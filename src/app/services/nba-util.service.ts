import { Injectable } from '@angular/core';
let nbaImageRoot = 'https://cdn.nba.com/headshots/nba/latest/1040x760/'
let nbaTeamRoot = 'https://global.nba.com/media/img/teams/00/logos/'

@Injectable({
  providedIn: 'root'
})
export class NbaUtilService {
  public nbaTeams: any;
  public NBAImages: any;

  constructor() {
    this.nbaTeams = {
      "TOR": {
      id: 81,
      city: "Toronto",
      name: "Raptors",
      abbreviation: "TOR",
      twitter: "#WeTheNorth",
      officialLogoImageSrc: nbaTeamRoot+"TOR_logo.svg"
      },
      "BOS": {
      id: 82,
      city: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
      twitter: "#BleedGreen",
      officialLogoImageSrc: nbaTeamRoot+"BOS_logo.svg"
      },
      "NYK": {
      id: 83,
      city: "New York",
      name: "Knicks",
      abbreviation: "NYK",
      twitter: "#NewYorkForever",
      officialLogoImageSrc: nbaTeamRoot+"NYK_logo.svg"
      },
      "BRO": {
      id: 84,
      city: "Brooklyn",
      name: "Nets",
      abbreviation: "BRO",
      twitter: "#BrooklynTogether",
      officialLogoImageSrc: nbaTeamRoot+"BKN_logo.svg"
      },
      "PHI": {
      id: 85,
      city: "Philadelphia",
      name: "76ers",
      abbreviation: "PHI",
      twitter: "#HereTheyCome",
      officialLogoImageSrc: nbaTeamRoot+"PHI_logo.svg"
      },
      "CLE": {
      id: 86,
      city: "Cleveland",
      name: "Cavaliers",
      abbreviation: "CLE",
      twitter: "#BeTheFight",
      officialLogoImageSrc: nbaTeamRoot+"CLE_logo.svg"
      },
      "IND": {
      id: 87,
      city: "Indiana",
      name: "Pacers",
      abbreviation: "IND",
      twitter: "#AlwaysGame",
      officialLogoImageSrc: nbaTeamRoot+"IND_logo.svg"
      },
      "DET": {
      id: 88,
      city: "Detroit",
      name: "Pistons",
      abbreviation: "DET",
      twitter: "#DetroitUp",
      officialLogoImageSrc: nbaTeamRoot+"DET_logo.svg"
      },
      "CHI": {
      id: 89,
      city: "Chicago",
      name: "Bulls",
      abbreviation: "CHI",
      twitter: "#BullsNation",
      officialLogoImageSrc: nbaTeamRoot+"CHI_logo.svg"
      },
      "MIL": {
      id: 90,
      city: "Milwaukee",
      name: "Bucks",
      abbreviation: "MIL",
      twitter: "#FearTheDeer",
      officialLogoImageSrc: nbaTeamRoot+"MIL_logo.svg"
      },
      "ATL": {
      id: 91,
      city: "Atlanta",
      name: "Hawks",
      abbreviation: "ATL",
      twitter: "#TrueToAtlanta",
      officialLogoImageSrc: nbaTeamRoot+"ATL_logo.svg"
      },
      "MIA": {
      id: 92,
      city: "Miami",
      name: "Heat",
      abbreviation: "MIA",
      twitter: "#HeatTwitter",
      officialLogoImageSrc: nbaTeamRoot+"MIA_logo.svg"
      },
      "CHA": {
      id: 93,
      city: "Charlotte",
      name: "Hornets",
      abbreviation: "CHA",
      twitter: "#AllFly",
      officialLogoImageSrc: nbaTeamRoot+"CHA_logo.svg"
      },
      "WAS": {
      id: 94,
      city: "Washington",
      name: "Wizards",
      abbreviation: "WAS",
      twitter: "#DCAboveAll",
      officialLogoImageSrc: nbaTeamRoot+"WAS_logo.svg"
      },
      "ORL": {
      id: 95,
      city: "Orlando",
      name: "Magic",
      abbreviation: "ORL",
      twitter: "#MagicTogether",
      officialLogoImageSrc: nbaTeamRoot+"ORL_logo.svg"
      },
      "OKL": {
      id: 96,
      city: "Oklahoma City",
      name: "Thunder",
      abbreviation: "OKL",
      twitter: "#ThunderUp",
      officialLogoImageSrc: nbaTeamRoot+"OKC_logo.svg"
      },
      "POR": {
      id: 97,
      city: "Portland",
      name: "Trail Blazers",
      abbreviation: "POR",
      twitter: "#RipCity",
      officialLogoImageSrc: nbaTeamRoot+"POR_logo.svg"
      },
      "UTA": {
      id: 98,
      city: "Utah",
      name: "Jazz",
      abbreviation: "UTA",
      twitter: "#TakeNote",
      officialLogoImageSrc: nbaTeamRoot+"UTA_logo.svg"
      },
      "DEN": {
      id: 99,
      city: "Denver",
      name: "Nuggets",
      abbreviation: "DEN",
      twitter: "#MileHighBasketball",
      officialLogoImageSrc: nbaTeamRoot+"DEN_logo.svg"
      },
      "MIN": {
      id: 100,
      city: "Minnesota",
      name: "Timberwolves",
      abbreviation: "MIN",
      twitter: "#RaisedByWolves",
      officialLogoImageSrc: nbaTeamRoot+"MIN_logo.svg"
      },
      "GSW": {
      id: 101,
      city: "Golden State",
      name: "Warriors",
      abbreviation: "GSW",
      twitter: "#DubNation",
      officialLogoImageSrc: nbaTeamRoot+"GSW_logo.svg"
      },
      "LAC": {
      id: 102,
      city: "Los Angeles",
      name: "Clippers",
      abbreviation: "LAC",
      twitter: "#ClipperNation",
      officialLogoImageSrc: nbaTeamRoot+"LAC_logo.svg"
      },
      "SAC": {
      id: 103,
      city: "Sacramento",
      name: "Kings",
      abbreviation: "SAC",
      twitter: "#SacramentoProud",
      officialLogoImageSrc: nbaTeamRoot+"SAC_logo.svg"
      },
      "PHX": {
      id: 104,
      city: "Phoenix",
      name: "Suns",
      abbreviation: "PHX",
      twitter: "#WeAreTheValley",
      officialLogoImageSrc: nbaTeamRoot+"PHX_logo.svg"
      },
      "LAL": {
      id: 105,
      city: "Los Angeles",
      name: "Lakers",
      abbreviation: "LAL",
      twitter: "#LakeShow",
      officialLogoImageSrc: nbaTeamRoot+"LAL_logo.svg"
      },
      "SAS": {
      id: 106,
      city: "San Antonio",
      name: "Spurs",
      abbreviation: "SAS",
      twitter: "#GoSpursGo",
      officialLogoImageSrc: nbaTeamRoot+"SAS_logo.svg"
      },
      "MEM": {
      id: 107,
      city: "Memphis",
      name: "Grizzlies",
      abbreviation: "MEM",
      twitter: "#GrindCity",
      officialLogoImageSrc: nbaTeamRoot+"MEM_logo.svg"
      },
      "DAL": {
      id: 108,
      city: "Dallas",
      name: "Mavericks",
      abbreviation: "DAL",
      twitter: "#MFFL",
      officialLogoImageSrc: nbaTeamRoot+"DAL_logo.svg"
      },
      "HOU": {
      id: 109,
      city: "Houston",
      name: "Rockets",
      abbreviation: "HOU",
      twitter: "#Rockets",
      officialLogoImageSrc: nbaTeamRoot+"HOU_logo.svg"
      },
      "NOP": {
      id: 110,
      city: "New Orleans",
      name: "Pelicans",
      abbreviation: "NOP",
      twitter: "#WontBowDown",
      officialLogoImageSrc: nbaTeamRoot+"NOP_logo.svg"
      }
    }

    this.NBAImages = {
      "17189": {
        firstName: "Ja",
        lastName: "Morant",
        image: nbaImageRoot+"1629630.png"
      },
      "17191": {
        firstName: "Darius",
        lastName: "Garland",
        image: nbaImageRoot+"1629636.png"
      },
      "17273": {
        firstName: "P.J.",
        lastName: "Washington",
        image: nbaImageRoot+"1629023.png"
      },
      "15252": {
        firstName: "Kendrick",
        lastName: "Nunn",
        image: nbaImageRoot+"1629134.png"
      },
      "17181": {
        firstName: "RJ",
        lastName: "Barrett",
        image: nbaImageRoot+"1629628.png"
      },
      "17196": {
        firstName: "Cam",
        lastName: "Reddish",
        image: nbaImageRoot+"1629629.png"
      },
      "17192": {
        firstName: "Jarett",
        lastName: "Culver",
        image: nbaImageRoot+"1629633.png"
      },
      "17190": {
        firstName: "De'Andre",
        lastName: "Hunter",
        image: nbaImageRoot+"1629631.png"
      },
      "17195": {
        firstName: "Rui",
        lastName: "Hachimura",
        image: nbaImageRoot+"1629060.png"
      },
      "17286": {
        firstName: "Kevin",
        lastName: "Porter Jr.",
        image: nbaImageRoot+"1629645.png"
      },
      "17331": {
        firstName: "Ky",
        lastName: "Bowman",
        image: nbaImageRoot+"1629065.png"
      },
      "17197": {
        firstName: "Cameron",
        lastName: "Johnson",
        image: nbaImageRoot+"1629661.png"
      },
      "17251": {
        firstName: "Brandon",
        lastName: "Clarke",
        image: nbaImageRoot+"1629634.png"
      },
      "17256": {
        firstName: "Sekou",
        lastName: "Doumbouya",
        image: nbaImageRoot+"1629635.png"
      },
      "17216": {
        firstName: "Terence",
        lastName: "Davis",
        image: nbaImageRoot+"1629056.png"
      },
      "17193": {
        firstName: "Coby",
        lastName: "White",
        image: nbaImageRoot+"1629632.png"
      },
      "17330": {
        firstName: "Eric",
        lastName: "Paschall",
        image: nbaImageRoot+"1629672.png"
      },
      "17329": {
        firstName: "Jordan",
        lastName: "Poole",
        image: nbaImageRoot+"1629673.png"
      },
      "17312": {
        firstName: "Caleb",
        lastName: "Martin",
        image: nbaImageRoot+"1628997.png"
      },
      "17255": {
        firstName: "Luguentz",
        lastName: "Dort",
        image: nbaImageRoot+"1629652.png"
      },
      "17295": {
        firstName: "Tyler", 
        lastName: "Herro",
        image: nbaImageRoot+"1629639.png"
      },
      "17240": {
        firstName: "Darius",
        lastName: "Bazley",
        image: nbaImageRoot+"1629647.png"
      },
      "17305": {
        firstName: "Keldon",
        lastName: "Johnson",
        image: nbaImageRoot+"1629640.png"
      },
      "27636": {
        firstName: "James",
        lastName: "Wiseman",
        image: nbaImageRoot+"1630164.png"
      },
      "27638": {
        firstName: "Anthony",
        lastName: "Edwards",
        image: nbaImageRoot+"1630162.png"
      },
      "27718": {
        firstName: "Payton",
        lastName: "Pritchard",
        image: nbaImageRoot+"1630202.png"
      },
      "27627": {
        firstName: "Patrick",
        lastName: "Williams",
        image: nbaImageRoot+"1630172.png"
      },
      "27469": {
        firstName: "LaMelo",
        lastName: "Ball",
        image: nbaImageRoot+"1630163.png"
      },
      "27587": {
        firstName: "Killian",
        lastName: "Hayes",
        image: nbaImageRoot+"1630165.png"
      },
      "17285": {
        firstName: "Naz",
        lastName: "Reid",
        image: nbaImageRoot+"1629675.png"
      },
      "17259": {
        firstName: "Daniel",
        lastName: "Gafford",
        image: nbaImageRoot+"1629655.png"
      },
      "17194": {
        firstName: "Jaxson",
        lastName: "Hayes",
        image: nbaImageRoot+"1629637.png"
      },
      "27454": {
        firstName: "Deni",
        lastName: "Avdija",
        image: nbaImageRoot+"1630166.png"
      },
      "27593": {
        firstName: "Saddiq",
        lastName: "Bey",
        image: nbaImageRoot+"1630180.png"
      },
      "27649": {
        firstName: "Desmond",
        lastName: "Bane",
        image: nbaImageRoot+"1630217.png"
      },
      "27637": {
        firstName: "Isaac",
        lastName: "Okoro",
        image: nbaImageRoot+"1630171.png"
      },
      "27450": {
        firstName: "Tyrese",
        lastName: "Maxey",
        image: nbaImageRoot+"1630178.png"
      },
      "27619": {
        firstName: "Tyrese",
        lastName: "Haliburton",
        image: nbaImageRoot+"1630169.png"
      },
      "27590": {
        firstName: "Cole",
        lastName: "Anthony",
        image: nbaImageRoot+"1630175.png"
      },
      "17208": {
        firstName: "Nickeil",
        lastName: "Alexander-Walker",
        image: nbaImageRoot+"1629638.png"
      },
      "15324": {
        firstName: "Gabe",
        lastName: "Vincent",
        image: nbaImageRoot+"1629216.png"
      },
      "27843": {
        firstName: "Precious",
        lastName: "Achiuwa",
        image: nbaImageRoot+"1630173.png"
      },
      "17229": {
        firstName: "Bol",
        lastName: "Bol",
        image: nbaImageRoot+"1629626.png"
      },
      "17234": {
        firstName: "KZ",
        lastName: "Okpala",
        image: nbaImageRoot+"1629644.png"
      },
      "27881": {
        firstName: "Isaiah",
        lastName: "Joe",
        image: nbaImageRoot+"1630198.png"
      },
      "27462": {
        firstName: "Xavier",
        lastName: "Tillman",
        image: nbaImageRoot+"1630214.png"
      },
      "17284": {
        firstName: "Isaiah",
        lastName: "Roby",
        image: nbaImageRoot+"1629676.png"
      },
      "27596": {
        firstName: "Jae Sean",
        lastName: "Tate",
        image: nbaImageRoot+"1630256.png"
      },
      "17270": {
        firstName: "Grant",
        lastName: "Williams",
        image: nbaImageRoot+"1629684.png"
      },
      "27652": {
        firstName: "Josh",
        lastName: "Green",
        image: nbaImageRoot+"1630182.png"
      },
      "27720": {
        firstName: "Anthony",
        lastName: "Gill",
        image: nbaImageRoot+"1630264.png"
      },
      "17224": {
        firstName: "Terrance",
        lastName: "Mann",
        image: nbaImageRoot+"1629611.png"
      },
      "17215": {
        firstName: "Amir",
        lastName: "Coffey",
        image: nbaImageRoot+"1629599.png"
      },
      "27642": {
        firstName: "Theo",
        lastName: "Maledon",
        image: nbaImageRoot+"1630177.png"
      },
      "27724": {
        firstName: "Immanuel",
        lastName: "Quickley",
        image: nbaImageRoot+"1630193.png"
      },
      "17233": {
        firstName: "Nassir",
        lastName: "Little",
        image: nbaImageRoot+"1629642.png"
      },
      "17423": {
        firstName: "Juan",
        lastName: "Toscano-Anderson",
        image: nbaImageRoot+"1629308.png"
      },
      "17217": {
        firstName: "Talen",
        lastName: "Horton-Tucker",
        image: nbaImageRoot+"1629659.png"
      },
      "17275": {
        firstName: "Matisse",
        lastName: "Thybulle",
        image: nbaImageRoot+"1629680.png"
      },
      "27644": {
        firstName: "Devin",
        lastName: "Vassell",
        image: nbaImageRoot+"1630170.png"
      },
      "17230": {
        firstName: "Chuma",
        lastName: "Okeke",
        image: nbaImageRoot+"1629643.png"
      },
      "27622": {
        firstName: "Isaiah",
        lastName: "Stewart",
        image: nbaImageRoot+"1630191.png"
      },
      "17276": {
        firstName: "Max",
        lastName: "Strus",
        image: nbaImageRoot+"1629622.png"
      },
      "17321": {
        firstName: "Mychal",
        lastName: "Mulder",
        image: nbaImageRoot+"1628539.png"
      },
      "17237": {
        firstName: "Tacko",
        lastName: "Fall",
        image: nbaImageRoot+"1629605.png"
      },
      "17315": {
        firstName: "Garrison",
        lastName: "Mathews",
        image: nbaImageRoot+"1629726.png"
      },
      "27614": {
        firstName: "Skylar",
        lastName: "Mays",
        image: nbaImageRoot+"1630219.png"
      },
      "17250": {
        firstName: "Moses",
        lastName: "Brown",
        image: nbaImageRoot+"1629650.png"
      },
      "27680": {
        firstName: "Facundo",
        lastName: "Campazzo",
        image: nbaImageRoot+"1630267.png"
      },
      "17211": {
        firstName: "Oshae",
        lastName: "Brissett",
        image: nbaImageRoot+"1629052.png"
      },
      
    }
   }

  public getNBATeams() {
    return this.nbaTeams;
  }

  public getNBAImages() {
    return this.NBAImages;
  }
}
