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

interface Stats {
    type: "hitting" | "pitching" | "fielding",
    value: {
        sun: {
            [index: string]: HouseValue[]
        },
        moon: {
            [index: string]: HouseValue[]
        }
    }
}

interface APIObject {
    current_position: Stars,
    players: {
        player_name: string,
        birthday_position: Stars,
        debut_position: Stars,
        stats: Stats[],
    }[]
}

export type { ZodiacSignType, HouseValue, Stars, Stats, APIObject };