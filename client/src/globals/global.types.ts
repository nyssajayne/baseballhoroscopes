type ZodiacSignType = "Aries" | "Taurus" | "Gemini" | 
    "Cancer" | "Leo" | "Virgo" | 
    "Libra" | "Sagittarius" | "Scorpio" | 
    "Capricorn" | "Aquarius" | "Pisces";

interface HouseValue {
    position: ZodiacSignType,
    value: number
}

interface Stars {
    sun: ZodiacSignType, moon: ZodiacSignType
}

interface Hitting {
    ops: HouseValue[],
    obp: HouseValue[],
    slugging: HouseValue[],
    battingAvg: HouseValue[]
}

interface Pitching {
    era: HouseValue[];
}

interface Fielding {

}

interface Stats {
    hitting?: {
        sun: Hitting,
        moon: Hitting
    },
    pitching?: {
        sun: Pitching,
        moon: Pitching
    },
    fielding?: {
        sun: Fielding,
        moon: Fielding
    }
}

interface Player {
    player_name: string,
    birthday_position: Stars,
    debut_position: Stars,
    stats: Stats,
}

interface APIObject {
    current_position: Stars,
    players: Player[]
}

export type { ZodiacSignType, HouseValue, Stars, Stats, Player, APIObject };