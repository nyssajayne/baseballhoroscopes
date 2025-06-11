import swisseph as swe
from datetime import datetime

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

def calc_sun_deg(jul_day):
    return swe.calc_ut(jul_day, swe.SUN)[0][0]

def calc_moon_deg(jul_day):
    return swe.calc_ut(jul_day, swe.MOON)[0][0]

def calc_moon_sign(jul_day):
    return calc_zodiac_sign(calc_moon_deg(jul_day))

def calc_sun_sign(jul_day):
    return calc_zodiac_sign(calc_sun_deg(jul_day))

def calc_asc(jd, location):
    lat, long = my_dict.values()
    ascmc, ascmc2 = swe.houses(jd, lat, long, b'P')

    ascendant = ascmc[0]
    return ascendant

def calc_zodiac_sign(degree):
    signs = [
        "01 Aries", "02 Taurus", "03 Gemini", "04 Cancer", "05 Leo", "06 Virgo",
        "07 Libra", "08 Scorpio", "09 Sagittarius", "10 Capricorn", "11 Aquarius", "12 Pisces"
        ]
    return signs[int(degree // 30)]

def sun_moon_dict(jul_day):
    sun_deg = calc_sun_deg(jul_day)
    moon_deg = calc_moon_deg(jul_day)

    return {
        'sun': calc_zodiac_sign(sun_deg),
        'moon': calc_zodiac_sign(moon_deg)
    }

def sun_moon_asc_dict(jul_day, location):
    sun_deg = calc_sun_deg(jul_day)
    moon_deg = calc_moon_deg(jul_day)
    ascendant = calc_asc(jul_day, location)

    return {
        'sun': calc_zodiac_sign(sun_deg),
        'moon': calc_zodiac_sign(moon_deg),
        'ascendant': calc_zodiac_sign(ascendant)
    }

def sun_moon_by_date(date):
    jul_day = day_to_julday(date)

    return sun_moon_dict(jul_day)

def sun_moon_by_zulu(zulu_timestamp):
    jul_day = zulu_to_julday(zulu_timestamp)

    return sun_moon_dict(jul_day)