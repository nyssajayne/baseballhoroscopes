import statsapi
import pprint
import swisseph as swe
from datetime import datetime
import pandas as pd
import sys

swe.set_ephe_path('/usr/share/sweph/ephe');

def zulu_to_julday(zulu_timestamp):
	dt = datetime.strptime(zulu_timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
	
	year = dt.year
	month = dt.month
	day = dt.day
	hour = dt.hour + dt.minute / 60 + dt.second / 3600

	return swe.julday(year, month, day, hour)

def day_to_julday(date):
	dt = datetime.strptime(date, "%Y-%m-%d")

	year = dt.year
	month = dt.month
	day = dt.day

	return swe.julday(year, month, day)

def calculate_ascendant(jd, lat, long):
	ascmc, ascmc2 = swe.houses(jd, lat, long, b'P')

	ascendant = ascmc[0]
	return ascendant

def calculate_zodiac_sign(degree):
	signs = [
		"01 Aries", "02 Taurus", "03 Gemini", "04 Cancer", "05 Leo", "06 Virgo",
		"07 Libra", "08 Scorpio", "09 Sagittarius", "10 Capricorn", "11 Aquarius", "12 Pisces"
	]
	return signs[int(degree // 30)]

def calculate_scoring_play_signs():
	gamePk = statsapi.schedule(team = 121, start_date = '2025-05-13', end_date = '2025-05-13')[0]["game_id"]
	game = statsapi.get('game', {'gamePk': gamePk})
	scoringPlays = game['liveData']['plays']['scoringPlays']
	allPlays = game['liveData']['plays']['allPlays']

	# Build playDetails as a list of dictionaries with startTime and description
	return [
	    {
	        "startTime": allPlays[i]['about']['startTime'],
	        "julian_day": (jul := zulu_to_julday(allPlays[i]['about']['startTime'])),
	        "ascendant_deg": (asc := calculate_ascendant(
	            jul,
	            game['gameData']['venue']['location']['defaultCoordinates']['latitude'],
	            game['gameData']['venue']['location']['defaultCoordinates']['longitude']
	        )),
	        "asc_zodiac": calculate_zodiac_sign(asc),
	        "moon_pos": (moon_pos := swe.calc_ut(jul, swe.MOON)[0][0]),
	        "moon_zodiac": calculate_zodiac_sign(moon_pos),
	        "sun_pos": (sun_pos := swe.calc_ut(jul, swe.SUN)[0][0]),
	        "sun_zodiac": calculate_zodiac_sign(sun_pos),
	        "description": allPlays[i]['result']['description']
	    }
	    for i in scoringPlays
	]

# Define the calculate_era function
def calculate_era(earned_runs, innings_pitched):
    if innings_pitched == 0:
        return float('inf')  # Avoid division by zero
    return (earned_runs / innings_pitched) * 9

# Group by 'sun_zodiac' and calculate ERA
def calculate_group_era(group):
    total_earned_runs = group['earned_runs'].sum()
    total_innings_pitched = group['outs'].sum() / 3  # Convert outs to innings
    return calculate_era(total_earned_runs, total_innings_pitched)

def calculate_batting_avg(hits, at_bats):
	return hits / at_bats

def calculate_group_batting_avg(group):
	total_hits = group['hits'].sum()
	total_at_bats = group['at_bats'].sum()
	return calculate_batting_avg(total_hits, total_at_bats)

def calculate_pitcher(splits):
	try:
		era_data = [{'earned_runs': stat['stat']['earnedRuns'],
					'outs': stat['stat']['outs'],
					'data': stat['date'],
					'sun_pos': swe.calc_ut(day_to_julday(stat['date']), swe.SUN)[0][0],
					'sun_zodiac': calculate_zodiac_sign(swe.calc_ut(day_to_julday(stat['date']), swe.SUN)[0][0]),
					} 
					for stat in splits]

		era_df = pd.DataFrame(era_data)

		return era_df.groupby('sun_zodiac').apply(calculate_group_era, include_groups=False).reset_index(name='ERA')
	except KeyError as e:
			print(f"KeyError: {e}")

def calculate_hitting(splits):
	try:
		hitting_data = [{'hits': stat['stat']['hits'],
						'at_bats': stat['stat']['atBats'],
						'data': stat['date'],
						'sun_pos': swe.calc_ut(day_to_julday(stat['date']), swe.SUN)[0][0],
						'sun_zodiac': calculate_zodiac_sign(swe.calc_ut(day_to_julday(stat['date']), swe.SUN)[0][0]),
						} 
						for stat in splits]

		hitting_df = pd.DataFrame(hitting_data)

		return hitting_df.groupby('sun_zodiac').apply(calculate_group_batting_avg, include_groups=False).reset_index(name='Batting Avg.')
	except KeyError as e:
			print(f"KeyError: {e}")


def lookup_a_guy(player):
	stats = statsapi.get('people', { 'personIds': player, 'hydrate': 'stats(group=[hitting,pitching],type=[gameLog],startDate=06/23/2021,endDate=05/18/2025)' })

	print(stats['people'][0]['firstLastName'] + ' ' + str(stats['people'][0]['id']))
	
	splits = stats['people'][0]['stats'][0]['splits']

	if(stats['people'][0]['primaryPosition']['code'] == '1'):
		pprint.pprint(calculate_pitcher(splits))
	
	pprint.pprint(calculate_hitting(splits))
	

if len(sys.argv) > 1:
	players = statsapi.lookup_player(sys.argv[1])

	for player in players:
		lookup_a_guy(player['id'])