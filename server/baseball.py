from datetime import datetime, timezone
import statsapi
import pandas as pd
import pprint

import astrology as astro
import stats as stats
# import sys

# def calculate_scoring_play_signs():
#     gamePk = statsapi.schedule(team = 121, start_date = '2025-05-13', end_date = '2025-05-13')[0]["game_id"]
#     game = statsapi.get('game', {'gamePk': gamePk})
#     scoringPlays = game['liveData']['plays']['scoringPlays']
#     allPlays = game['liveData']['plays']['allPlays']

#     # Build playDetails as a list of dictionaries with startTime and description
#     return [
#         {
#             "startTime": allPlays[i]['about']['startTime'],
#             "julian_day": (jul := zulu_to_julday(allPlays[i]['about']['startTime'])),
#             "ascendant_deg": (asc := calculate_ascendant(
#                 jul,
#                 game['gameData']['venue']['location']['defaultCoordinates']['latitude'],
#                 game['gameData']['venue']['location']['defaultCoordinates']['longitude']
#             )),
#             "asc_zodiac": calculate_zodiac_sign(asc),
#             "moon_pos": (moon_pos := swe.calc_ut(jul, swe.MOON)[0][0]),
#             "moon_zodiac": calculate_zodiac_sign(moon_pos),
#             "sun_pos": (sun_pos := swe.calc_ut(jul, swe.SUN)[0][0]),
#             "sun_zodiac": calculate_zodiac_sign(sun_pos),
#             "description": allPlays[i]['result']['description']
#         }
#         for i in scoringPlays
#     ]

# Group by 'sun_zodiac' and calculate ERA
def calc_group_era(group):
    total_earned_runs = group['earned_runs'].sum()
    total_innings_pitched = group['outs'].sum() / 3  # Convert outs to innings
    return stats.calc_era(total_earned_runs, total_innings_pitched)

def calc_group_batting_avg(group):
    total_hits = group['hits'].sum()
    total_at_bats = group['at_bats'].sum()
    return stats.calc_batting_avg(total_hits, total_at_bats)

def calc_group_obp(group):
    total_hits = group['hits'].sum()
    total_walks = group['walks'].sum()
    total_hit_by_pitch = group['hit_by_pitch'].sum()
    total_at_bats = group['at_bats'].sum()
    total_sac_fly = group['sac_fly'].sum()
    return stats.calc_obp(total_hits, total_walks, total_hit_by_pitch, total_at_bats, total_sac_fly)

def calc_group_slg(group):
    total_bases = group['total_bases'].sum()
    total_at_bats = group['at_bats'].sum()
    return stats.calc_slg(total_bases, total_at_bats)

def calc_group_ops(group):
    obp = calc_group_obp(group)
    slg = calc_group_slg(group)
    return stats.calc_ops(obp, slg)


def calc_pitcher(splits):
    try:
        era_data = [{'earned_runs': stat['stat']['earnedRuns'],
            'outs': stat['stat']['outs'],
            'data': stat['date'],
            'sun_pos': astro.calc_sun_deg(astro.day_to_julday(stat['date'])),
            'sun_zodiac': astro.calc_sun_sign(astro.day_to_julday(stat['date'])),
            'moon_pos': astro.calc_moon_deg(astro.day_to_julday(stat['date'])),
            'moon_zodiac': astro.calc_moon_sign(astro.day_to_julday(stat['date'])),
        } 
        for stat in splits]

        era_df = pd.DataFrame(era_data)

        zodiac = [
            ('sun', era_df.groupby('sun_zodiac')),
            ('moon', era_df.groupby('moon_zodiac'))
        ]

        chart = {
            group_key: group_df.apply(calc_group_era, include_groups=False).reset_index(name='ERA')
            for group_key, group_df in zodiac
        }

        return {key: columns_to_dict(group) for key, group in chart.items()}
    except KeyError as e:
        print(f"KeyError: {e}")

def columns_to_dict(data):
    # Assuming `data` is a DataFrame or a list of lists
    first_column = data.iloc[:, 0]  # First column (keys)
    second_column = data.iloc[:, 1]  # Second column (values)
    
    # Create a dictionary from the two columns
    return dict(zip(first_column, second_column))


def calc_hitting(splits):
    try:
        hitting_data = [{'hits': stat['stat']['hits'],
            'at_bats': stat['stat']['atBats'],
            'walks': stat['stat']['baseOnBalls'],
            'hit_by_pitch': stat['stat']['hitByPitch'],
            'sac_fly': stat['stat']['sacFlies'],
            'total_bases': stat['stat']['totalBases'],
            'data': stat['date'],
            'sun_pos': astro.calc_sun_deg(astro.day_to_julday(stat['date'])),
            'sun_zodiac': astro.calc_sun_sign(astro.day_to_julday(stat['date'])),
            'moon_pos': astro.calc_moon_deg(astro.day_to_julday(stat['date'])),
            'moon_zodiac': astro.calc_moon_sign(astro.day_to_julday(stat['date'])),
        } 
        for stat in splits]

        hitting_df = pd.DataFrame(hitting_data)


        zodiac = [
            ('sun', hitting_df.groupby('sun_zodiac')),
            ('moon', hitting_df.groupby('moon_zodiac'))
        ]

        stats = [
            ('batting avg.', calc_group_batting_avg),
            ('OBP', calc_group_obp),
            ('Slugging', calc_group_slg),
            ('OPS', calc_group_ops)
        ]

        chart = {
            group_key: {
                stats_key: columns_to_dict(
                    group_df.apply(stats_func, include_groups=False).reset_index(name=stats_key)
                )
                for stats_key, stats_func in stats
            }
            for group_key, group_df in zodiac
        }

        return chart
    except KeyError as e:
        print(f"KeyError: {e}")


def lookup_a_guy(a_guy):
    players = statsapi.lookup_player(a_guy)

    pprint.pprint(players)

    todays_date = datetime.now(timezone.utc)
    zulu_time = todays_date.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    the_guys = {
        'current_position': astro.sun_moon_by_zulu(zulu_time),
        'players': []
    }

    pprint.pprint(the_guys)
    
    for player in players:
        stats = statsapi.get('people', { 'personIds': player['id'], 'hydrate': 'stats(group=[hitting,pitching],type=[gameLog],startDate=06/23/2021,endDate=05/18/2025)' })

        player_stats = stats['people'][0]['stats']

        the_guy = {
            'player_name': stats['people'][0]['firstLastName'],
            'debut_position': astro.sun_moon_by_date(stats['people'][0]['mlbDebutDate']),
            'birthday_position': astro.sun_moon_by_date(stats['people'][0]['birthDate'])
        };

        for i in player_stats:
            display_name = i['group']['displayName']
            splits = i['splits'];

            if(display_name == 'pitching'):
                the_guy['pitching'] = calc_pitcher(splits)
            if(display_name == 'hitting'):
                the_guy['hitting'] = calc_hitting(splits)

        the_guys['players'].append(the_guy)

    return the_guys

# if len(sys.argv) > 1:
#     players = statsapi.lookup_player(sys.argv[1])

#     for player in players:
#         lookup_a_guy(player['id'])