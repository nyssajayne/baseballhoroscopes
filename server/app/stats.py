def calc_era(earned_runs, innings_pitched):
    if innings_pitched == 0:
        return float('inf')  # Avoid division by zero
    return (earned_runs / innings_pitched) * 9

def calc_batting_avg(hits, at_bats):
    if(hits == 0):
        return 0
    return hits / at_bats

def calc_obp(hits, walks, hit_by_pitch, at_bats, sac_fly):
    if(hits == 0 and walks == 0 and hit_by_pitch == 0):
        return 0
    return (hits + walks + hit_by_pitch) / (at_bats + walks + hit_by_pitch + sac_fly);

def calc_slg(total_bases, at_bats):
    if(total_bases == 0):
        return 0;
    return total_bases / at_bats

def calc_ops(obp, slg):
    if(obp == 0):
        return 0;
    return obp + slg