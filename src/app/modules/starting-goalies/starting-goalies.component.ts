import { Observable, interval, forkJoin } from 'rxjs';
import { Component, ViewChild, Inject, OnInit, ChangeDetectorRef, ViewChildren, PLATFORM_ID  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DatePipe, PercentPipe, isPlatformBrowser } from '@angular/common';
import * as CryptoJS from 'crypto-js';

import {
  NHLDataService,
  FirebaseService,
  UtilService,
  GoogleAnalyticsService,
  NhlUtilService,
 } from '../../services/index';

//DATE FORMAT FOR FULL SCHEDULE API COMPARE DATES FOR BACK TO BACK
let today = null;
let tomorrow = null;
let yesterday = null;

let headers = null;
let dailyTeams = [];
let teamRef = [];
let teamString = '';
let teams = null;
let startingGoalieArray = null;
let skaterString = null;

@Component({
  selector: 'app-starting-goalies',
  templateUrl: './starting-goalies.component.html',
  styleUrls: ['./starting-goalies.component.scss']
})
export class StartingGoaliesComponent implements OnInit {

  @ViewChildren('myInput') vc;

  public goalies = new FormControl();
  public starters: Array <any>;
  public dailySchedule: Array <any>;
  public fullSchedule: Array <any>;
  public starterIdData: Array <any> = [];
  public startersData: Array <any> = [];
  public gameGroups: Array <any>;
  public dailyStats: Array <any> = [];
  public dailySkaterStats: Array <any> = [];
  public teamRef: Array <any> = [];
  public myData: Array <any>;
  public newGoalieData: Array <any>;
  public newSkaterData: Array <any>;
  public mySkaterData: Array <any>;
  public showData: Array <any>;
  public showSkaterData: Array <any>;
  public showTomorrow: Array <any>;
  public score: Array <any>;
  public sentData: Array <any>;
  public sentYesterdayData: Array <any>;
  public sentTomorrowData: Array <any>;
  public gameDate: string = '';
  public defineToken: string = '';
  public statData: Array <any> = [];
  public playerInfo: Array <any>;
  public playerInjuries: Array <any>;
  public noGamesToday: boolean;
  public gamesToday: boolean;
  public twitterHandles: Array <any>;
  public todayStarters: Array <any>;
  public tomorrowStarters: Array <any>;
  public allGoalies: Array <any>;
  public allGoaliesTomorrow: Array <any>;
  public selected: any;
  public startingGoaliesToday: Array <any> = [];
  public tweetDay: any;
  public noGamesMsg: any;
  public noScoresMsg: any;
  public noScores: any;
  public startersDate: any;
  public startersDateTomorrow: any;
  public tomorrowDate: any;
  public fullFirebaseResponse: any;
  public loading: boolean = true;
  public apiRoot: string = "https://api.mysportsfeeds.com/v2.1/pull/nhl/2020-2021-regular";
  public teamSchedules: Array <any> = [];
  public stats: boolean = false;
  public weekResults: boolean = false;
  public mobile: boolean = false;
  public hitCount: any;
  public playerImages: any;
  public teams: any;
  public startingG: any;
  public goalieIdSet: boolean = false;
  public standIn: string = '';
  public goalieID: string = '';
  public isOpen: boolean = false;
  public tweetsData: Array <any> = [];
  public noPosts: any;
  public submitting: boolean = false;
  public selectedPlayer: any;
  public type: any;
  public image: any;
  public name: any;
  public area: any;
  public starterStatData: Array <any> = [];
  public gameSkaters: Array <any> = [];
  public skaterIdData: Array <any> = [];
  public showLwData: Array <any> ;
  public sentHotData: Array <any> ;
  public sentAllData: Array <any> ;
  public sentYesterday: any;
  public sentLastweek: any;
  public modalType: any;
  public title: any;
  public newGoalie = {
    [this.standIn]: {
      confirmed: false,
      name: null,
      probable: false,
      image: null,
      atHandle: null,
      twitterHandle: null
    }
  };
  public testBrowser: boolean;
  public twitter: boolean;
  public gameStarter: any;
  public goalieSection: boolean = true;
  public lineSection: boolean = false;
  public scheduleSection: boolean = false;
  public spinTitle: any;
  public errMessage: any;
  public gameSkaterGroups: Array <any>;
  public statSkaterData: Array <any> = [];
  public stat: number = 1;
  public newGoalieArray = [
  //   {
  //   id: 14365,
  //   firstName: 'Vitek',
  //   lastName: 'Vanecek',
  //   teamId: 5,
  //   teamAbb: 'WSH',
  //   teamName: 'Capitals',
  //   teamCity: 'Washington D.C.',
  //   image: 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8477970.jpg'
  // },
  // {
  //   id: 14350,
  //   firstName: 'Collin',
  //   lastName: 'Delia',
  //   teamId: 20,
  //   teamAbb: 'CHI',
  //   teamName: 'Blackhawks',
  //   teamCity: 'Chicago',
  //   image: 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8480420.jpg'
  // },
  {
    id: 4235,
    firstName: 'Jaroslav',
    lastName: 'Halak',
    teamId: 11,
    teamAbb: 'BOS',
    teamName: 'Bruins',
    teamCity: 'Boston',
    image: 'https://cms.nhl.bamgrid.com/images/headshots/current/168x168/8470860.jpg'
  }
]

  constructor(private cdr: ChangeDetectorRef, 
    private http: HttpClient,
    public dataService: NHLDataService, 
    public fbService: FirebaseService,  
    public router: Router, 
    public util: UtilService,
    public nhlUtil: NhlUtilService,
    public gaService: GoogleAnalyticsService,
    @Inject(PLATFORM_ID) platformId: string) {
    yesterday = this.dataService.getYesterday();
    tomorrow = this.dataService.getTomorrow();
    today = this.dataService.getToday();
    this.tomorrowDate = tomorrow;
    console.log(yesterday + ' yesterday, ' + today + ' today, ' + tomorrow + ' tomorrow, ');
    // this.sentData = this.dataService.getSentStats();
    // this.sentYesterdayData = this.yesterdayService.getSentStats();
    // this.sentTomorrowData = this.tomorrowService.getSentStats();
    this.playerImages = this.util.getNHLImages();
    this.teams = this.util.getNHLTeams();
    this.startingG = this.util.getStartingGoalies();
    startingGoalieArray = Object.values(this.startingG);
    this.sentHotData = this.dataService.getSentHotStats();
    this.sentAllData = this.dataService.getSentAllStats();
    this.sentYesterday = this.dataService.getYesterday();
    this.sentLastweek = this.dataService.getLastweek();

    this.dataService.checkDay();
    this.testBrowser = isPlatformBrowser(platformId);
  }

  public statToggle() {
    if (this.stat === 1) {
      this.stat = 2;
    } else if (this.stat === 2) {
      this.stat = 3;
    } else if (this.stat === 3) {
      this.stat = 4;
    } else if (this.stat === 4) {
      this.stat = 5;
    } else if (this.stat === 5) {
      this.stat = 6;
    } else if (this.stat === 6) {
      this.stat = 1;
    }
  }

  public getByDate(event) {
    this.loading = true;
    this.dataService.selectedDate(event);
    this.dataService.checkDay();
    yesterday = this.dataService.getYesterday();
    tomorrow = this.dataService.getTomorrow();
    today = this.dataService.getToday();
    this.tomorrowDate = tomorrow;
    console.log(yesterday + ' yesterday, ' + today + ' today, ' + tomorrow + ' tomorrow, ');

    //empty old data on data change 
    this.dailySchedule = [];
    dailyTeams = [];
    this.starterIdData = [];
    this.skaterIdData = [];
    this.startersData = [];
    this.startingGoaliesToday = [];
    teamRef = [];
    this.dailyStats = [];
    this.dailySkaterStats = [];
    teamString = '';
    skaterString = '';
    this.myData = [];
    this.showData = [];
    this.mySkaterData = [];
    this.showSkaterData = [];
    this.score = [];
    this.teamSchedules = [];
    this.fullSchedule = [];
    this.statData = [];
    this.statSkaterData = [];
    this.gameGroups = [];
    this.gameSkaterGroups = [];
    this.gamesToday = false;
    this.noGamesMsg = '';
    this.goalieSection = true;
    this.lineSection = false;
    this.scheduleSection = false;
    this.loadData();
  }


  async loadData() {
    let promiseOne;
    promiseOne = new Promise((resolve, reject) => {
    this.fbService
      .getStarterData()
        .subscribe(res => {

        if (res[0] != null) {
          //console.log(res, 'got response from firebase...');
          this.fullFirebaseResponse = res[0];
          this.startersDate = res[0][0]['todayDate'];
          this.startersDateTomorrow = res[0][2]['tomorrowDate'];
          this.todayStarters = res[0][1];
          this.tomorrowStarters = res[0][3];
          this.allGoalies = Array.of(res[0][1]);
          this.allGoaliesTomorrow = Array.of(res[0][3]);
      

          // This is to change a goalie in view without refresh
          if (this.showData != null && this.myData != null) {
            for (let show of this.showData) {
              for (let rep of this.myData) {
                //console.log(show, 'showData items...');
                if (this.dataService.isToday && this.startersDate === today && show.goalies != null) {
                  for (let away of show.goalies['away']) {
                    if (away.playerObj.player.id && rep.player.id && this.fullFirebaseResponse[1][rep.player.id]) {
                      show.goalies['away'] = this.fullFirebaseResponse[1][rep.player.id].confirmed === true ? [away] : this.fullFirebaseResponse[1][rep.player.id].probable === true ? [away] : [away];
                      show.goalies['away'][0].size = this.fullFirebaseResponse[1][rep.player.id].confirmed === true ? 'reg' : away.size;
                    }
                  }

                  for (let home of show.goalies['home']) {
                    if (home.playerObj.player.id && rep.player.id && this.fullFirebaseResponse[1][rep.player.id]) {
                      show.goalies['home'] = this.fullFirebaseResponse[1][rep.player.id].confirmed === true ? [home] : this.fullFirebaseResponse[1][rep.player.id].probable === true ? [home] : [home];
                      show.goalies['home'][0].size = this.fullFirebaseResponse[1][rep.player.id].confirmed === true ? 'reg' : home.size;
                    }
                  }
                }
                if (this.dataService.isTomorrow && this.startersDate === today && show.goalies != null) {
                  for (let away of show.goalies['away']) {
                    if (away.playerObj.player.id && rep.player.id && this.fullFirebaseResponse[3][rep.player.id]) {
                      show.goalies['away'] = this.fullFirebaseResponse[3][rep.player.id].confirmed === true ? [away] : this.fullFirebaseResponse[3][rep.player.id].probable === true ? [away] : [away];
                      show.goalies['away'][0].size = this.fullFirebaseResponse[3][rep.player.id].confirmed === true ? 'reg' : away.size;
                    }
                  }

                  for (let home of show.goalies['home']) {
                    if (home.playerObj.player.id && rep.player.id && this.fullFirebaseResponse[3][rep.player.id]) {
                      show.goalies['home'] = this.fullFirebaseResponse[3][rep.player.id].confirmed === true ? [home] : this.fullFirebaseResponse[3][rep.player.id].probable === true ? [home] : [home];
                      show.goalies['home'][0].size = this.fullFirebaseResponse[3][rep.player.id].confirmed === true ? 'reg' : home.size;
                    }
                  }

                }

              }
            }
          }


        } else {

          console.log('removed db fb callback was undefined, go get goalie data again please...')

          this.fbService
            .getStarterData()
            .subscribe(res => {

              if (res[0] != null) {
                //console.log(res, 'got response from firebase...');
                this.fullFirebaseResponse = res[0];
                this.startersDate = res[0][0]['todayDate'];
                this.todayStarters = res[0][1];
                this.tomorrowStarters = res[0][3];
                this.allGoalies = Array.of(res[0][1]);
                this.allGoaliesTomorrow = Array.of(res[0][3]);
              }

            });
        }

        resolve();
    });
  });

  let resultOne = await promiseOne;

    this.dataService
      .getEnv().subscribe(res => {
        let bytes  = CryptoJS.AES.decrypt(res, 'footballSack');
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        headers = new HttpHeaders().set("Authorization", "Basic " + btoa(originalText + ":" + 'MYSPORTSFEEDS'));
       
        this.dataService
          .sendHeaderOptions(headers);

        this.dataService
          .getDailySchedule().subscribe(res => {

            //console.log(res, "schedule...");

            if (res['games'].length === 0) {
              this.loading = false;
              this.noGamesToday = true;
              this.noGamesMsg = "There Are No Games Scheduled Today :(";
              console.log('There are no games being played today.');
            } else {
              let postponed;
              res['games'].forEach((item, index) => {

                //if(this.fbService.userDetails === null) {
                 
                  dailyTeams.push(item['schedule'].homeTeam.abbreviation, item['schedule'].awayTeam.abbreviation); 
                  teamString = dailyTeams.join();
                //}
                
                // postponed = index;
                // if (res['games'][postponed].id === '41392') {
                //   console.log(res['games'][postponed], "hi, iam postponed and causing trouble...");
                //   res['games'].splice(postponed, 1);
                // }
              });
              this.dailySchedule = res['games'];
              teamRef = res['references'] ? res['references'].teamReferences : [];
              this.gameDate = res['games'][0] != null ? res['games'][0].schedule.startTime : res['games'][1] != null ? res['games'][1].schedule.startTime : new Date(); //res['games'][0].date;
              let dPipe = new DatePipe("en-US");
              this.tweetDay = dPipe.transform(this.gameDate, 'EEEE');
              this.gamesToday = true;
              //this.sortData(); //work around when no games

              if (this.teamSchedules.length === 0) {
                let team;
                let teamSchedule;
                const nhlTeamsArray = Object.values(this.teams);
                forkJoin(
                  nhlTeamsArray.map(
                    g => 
                    
                     this.http.get(`${this.apiRoot}/games.json?team=${g['abbreviation']}&date=from-20210113-to-20210124`, { headers })
                    
                  )
                )
                .subscribe(res => {
                  //console.log(res, 'get team schedules...');

                  res.forEach((item, index) => {
                    team = nhlTeamsArray[index]['abbreviation'];
                    //team = teamRef[index].abbreviation;
                    teamSchedule = {
                      team: team,
                      schedule: res[index]['games'],
                      teamInfo: nhlTeamsArray[index]
                    }
                    this.teamSchedules.push(teamSchedule);
                    //console.log(this.teamSchedules, 'schedules array...');

                  })
                  

                 // this.sortData();

                }, (err: HttpErrorResponse) => {
                  
                  console.log(err, 'error getting schedule');

              });

              } else {
                //this.sortData();
              }

              forkJoin(
                  res['games'].map(
                    g =>  this.http.get(`${this.apiRoot}/games/`+g['schedule'].id+`/lineup.json?position=Goalie-starter,ForwardLine1-LW,ForwardLine1-RW,ForwardLine1-C,DefensePair1-R,DefensePair1-L`, {headers})
                  )
                )
                .subscribe(res => {
                  let i;
                  let i2;
                  let res2;
                  let game2 = null;
                  let score2 = null;
                  
                  res.forEach((item, index) => {
                    i = index;
                    try {
                      game2 = res[i]['game'];
                      res2 = res[i]['teamLineups'];
                      score2 = this.dailySchedule[i].score;
                    } catch {
                      console.log('bad endpoint');
                    }
                    //console.log(res[i]['teamLineups'], 'got starting lineups data!');
                    
                    res2.forEach((item, index) => {

                      i2 = index;
                      if (res2[i2].actual != null && res2[i2].expected != null) { 
                        //console.log(res2[i2], 'got player ID for goalie actualy starting!');
                          for (let position of res2[i2].actual.lineupPositions) {
                            //console.log(position, 'got player ID for goalie actualy starting!');
                          //console.log(res2[i2].actual.starter[0].player, 'got player ID for goalie actualy starting!');
                            if (position.player != null) {
                              this.gameStarter = {
                                playerID: position.player.id,
                                name: position.player.lastName,
                                team: res2[i2].team.id,
                                gameID: game2.id,
                                score: score2,
                                status: game2.playedStatus,
                                scheduleStatus: game2.scheduleStatus,
                                position: position.player['position'],
                                startType: 'actual'
                              }
                              if (position.player['position'] === 'G') {
                                this.starterIdData.push(position.player.id);
                              } else {
                                this.gameSkaters.push(this.gameStarter);
                                this.skaterIdData.push(position.player.id);
                              }
                          }
                        }
                        skaterString = this.skaterIdData.join();
                      } else if (res2[i2].actual == null && res2[i2].expected != null) {
                        for (let position of res2[i2].expected.lineupPositions) {
                          //console.log(position, 'got player ID for goalie actualy starting!');
                            if (position.player != null) {
                              this.gameStarter = {
                                playerID: position.player.id,
                                name: position.player.lastName,
                                team: res2[i2].team.id,
                                gameID: game2.id,
                                score: score2,
                                status: game2.playedStatus,
                                scheduleStatus: game2.scheduleStatus,
                                position: position.player['position'],
                                startType: 'actual'
                              }
                              if (position.player['position'] === 'G') {
                                this.starterIdData.push(position.player.id);
                              } else {
                                this.gameSkaters.push(this.gameStarter);
                                this.skaterIdData.push(position.player.id);
                              }
                          }
                        }
                        skaterString = this.skaterIdData.join();
                       
                      } else {
                        //console.log(res2[i2].team.City + " " + res2[i2].team.Name, 'no starters yet!');
                        this.starterIdData.push(res2[i2].team.id);
                      }

                    });
                  });

                  this.sortData();

                });
                //this.sortData();
            }

          })


        this.dataService
          .getGameId().subscribe(res => {
           // console.log(res['games'], "scheduled games for yesterday today and tomorrow...");
            this.fullSchedule = res['games'];
          })

      })

  }


 async sortData() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let promiseOne;
    
    promiseOne = new Promise((resolve, reject) => {
    if (this.gamesToday === true) {
      this.dataService
        .getDaily().subscribe(res => {
          if (res != null) this.dailyStats = res['gamelogs'];
          resolve();
        })
    } else {
      console.log('No games');
      resolve();
    }
  })

  let resultOne = await promiseOne;

  // this.dataService
  //     .getUnusualStats().subscribe(res => {
  //       console.log(res, 'u stats...')
  //     })

    this.dataService
      .getStats(teamString).subscribe(async res => {

        let specialImgNum = null;
        function removeDuplicatesBy(keyFn, array) {
          var mySet = new Set();
          return array.filter(function(x) {  
              var key = keyFn(x), isNew = !mySet.has(key);
              if (isNew) mySet.add(key);  
              return isNew;
          });
        }

        function teamInfo(array, teams) {
          for (let team of teams) {
            for (let data of array) { 
              
              if (data.player['currentTeam'] != null 
              && team['id'] === data.player['currentTeam'].id 
              && data.player['currentTeam'].id === data.team.id 
              || team['id'] === data.team.id) {
                data.team.logo = team['officialLogoImageSrc'];
                data.team.city = team['city'];
                data.team.name = team['name'];
                data.team.abbreviation = team['abbreviation'];
                data.player.twitterHandle = team['twitter'];
              }
            }
          }
        }

      const nhlTeamsArray = Object.values(this.teams);
      let values = [];
      console.log('got player stats')
      if (res != null) values = res['playerStatsTotals'];
      this.myData = removeDuplicatesBy(x => x.player.id, values)

      this.dataService
          .getGoaliesToday(teamString).subscribe(res => {
            console.log('got players');
            this.newGoalieData = res['players'];
            for (let n of this.newGoalieData) {
              for (let old of this.myData) {
                old.player.gameLocation = "none";
                if (old.player['currentTeam'] != null)
                  old.player['currentTeam'].lastYearTeamId = old.player['currentTeam'] != null ? old.player['currentTeam'].id : 0;
                if (n.player.id === old.player.id && n['teamAsOfDate'] != null) {
                  old.player['currentTeam'].id = n['teamAsOfDate'].id;
                  old.player['currentTeam'].abbreviation = n['teamAsOfDate'].abbreviation;
                  old.team.abbreviation = n['teamAsOfDate'].abbreviation;
                  old.team.id = n['teamAsOfDate'].id;
                } 
                
                if (old.player.officialImageSrc != null) {
                  specialImgNum = old.player.officialImageSrc.substring(
                    old.player.officialImageSrc.lastIndexOf("/") + 1, 
                    old.player.officialImageSrc.lastIndexOf(".")
                    );
                    
                  old.player.officialImageSrc = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/"+specialImgNum+".jpg";
                }
  
                if (old.player.officialImageSrc == null) {
                  old.player.officialImageSrc = this.playerImages[old.player.id] != null ? this.playerImages[old.player.id].image : null;
                }
              }
            }
           
            for (let item of this.newGoalieArray) {
              let newGoalie = this.nhlUtil.getNewGoalie();
              console.log(newGoalie, 'new goalie');
              newGoalie.player.id = item.id;
              newGoalie.player.firstName = item.firstName;
              newGoalie.player.lastName = item.lastName;
              newGoalie.player.currentTeam.id = item.teamId;
              newGoalie.player.currentTeam.abbreviation = item.teamAbb;
              newGoalie.player.officialImageSrc = item.image;
              newGoalie.team.id = item.teamId;
              newGoalie.team.abbreviation = item.teamAbb;
              this.myData.push(newGoalie)
            };

            
            
            teamInfo(this.myData, nhlTeamsArray);
            // this.nflOffenseLoading = false;
        });

        
    
        // this.myData = res['playerStatsTotals'].filter(
        //   player => player.team != null && player.player['currentTeam'] != null && player.player['currentTeam'].id === player.team.id || player.player.lastName === 'Miska' && player.team != null); 
        console.log('waiting 6 seconds');
        await sleep(6000);
        if (this.myData && this.dailySchedule) {
          console.log('ok 6 seconds up lets go!!')
          if (this.dataService.isToday) {
            if (this.startersDate != today && this.startersDateTomorrow != tomorrow) {
              //reset firebase probable and confirms
              this.reset();
            }
            if (this.startersDateTomorrow != tomorrow) {
               //reset firebase probable and confirms
               this.selectAll();
            }
          }
          if (this.dataService.isTomorrow) {
            if (this.startersDate != yesterday && this.startersDateTomorrow != today) {
              //reset firebase probable and confirms
              this.reset();
            }
            if (this.startersDateTomorrow != today) {
               //reset firebase probable and confirms
               this.selectAll();
            }
          }
          
          // for (let data of startingGoalieArray) {
          //   data.tormorrow = tomorrow;
          // }
          for (let schedule of this.dailySchedule) {

            for (let sdata of this.myData) {
              
              for (let team of teamRef) {
                 
              
              sdata.player.lastweekWins = 0;
              sdata.player.lastweekLosses = 0;
              sdata.player.lastweekOtl = 0;
              
              
              //sdata.team = {};

              if (sdata.team != null && schedule['schedule'].awayTeam.abbreviation === sdata.team.abbreviation) {
                sdata.player.gameTime = schedule['schedule'].startTime;
                sdata.team.gameIce = schedule['schedule'].venue.name;

                sdata.team.gameId = schedule['schedule'].id;
                sdata.player.gameLocation = "away";
                sdata.team.day = this.tweetDay;
                sdata.team.opponentId = schedule['schedule'].homeTeam.id;
                sdata.team.id = schedule['schedule'].homeTeam.id;
                sdata.team.opponentAbbreviation = schedule['schedule'].homeTeam.abbreviation;
                sdata.team.today = today;
                sdata.team.tomorrow = tomorrow;
                sdata.team.yesterday = yesterday;
                sdata.player.confirmed = false;
                sdata.player.probable = false;
                sdata.player.startstatus = '';
                sdata.flip = 'inactive';
                sdata.status = schedule['schedule'].playedStatus;
                sdata.schedStatus = schedule['schedule'].scheduleStatus;
                sdata.teamScore = schedule['score'].awayScoreTotal;
                sdata.opponentScore = schedule['score'].homeScoreTotal;

                if(sdata.player.currentTeam != null && sdata.player.currentTeam.id === team.id) {
                  sdata.team.teamFull = team.city +' '+ team.name;   
                  sdata.team.teamCity = team.city;
                  sdata.team.teamName = team.name;
                }

                if (sdata.team.opponentId === team.id) {
                  sdata.team.opponent = team.city +' '+ team.name;   
                  sdata.team.opponentCity = team.city;
                  sdata.team.opponentName = team.name;
                }

              }
              if (sdata.team != null && schedule['schedule'].homeTeam.abbreviation === sdata.team.abbreviation) {
                sdata.player.gameTime = schedule['schedule'].startTime;
                sdata.team.gameIce = schedule['schedule'].venue.name;
                sdata.team.gameId = schedule['schedule'].id;
                sdata.player.gameLocation = "home";
                sdata.team.day = this.tweetDay;
                sdata.team.opponentId = schedule['schedule'].awayTeam.id;
                sdata.team.id = schedule['schedule'].awayTeam.id;
                sdata.team.opponentAbbreviation = schedule['schedule'].awayTeam.abbreviation;
                sdata.team.today = today;
                sdata.team.tomorrow = tomorrow;
                sdata.team.yesterday = yesterday;
                sdata.player.confirmed = false;
                sdata.player.probable = false;
                sdata.player.startstatus = '';
                sdata.flip = 'inactive';
                sdata.status = schedule['schedule'].playedStatus;
                sdata.schedStatus = schedule['schedule'].scheduleStatus;
                sdata.teamScore = schedule['score'].homeScoreTotal;
                sdata.opponentScore = schedule['score'].awayScoreTotal;

                if(sdata.player.currentTeam != null && sdata.player.currentTeam.id === team.id) {
                  sdata.team.teamFull = team.city +' '+ team.name;   
                  sdata.team.teamCity = team.city;
                  sdata.team.teamName = team.name;
                }
                if (sdata.team.opponentId === team.id) {
                  sdata.team.opponent = team.city +' '+ team.name;   
                  sdata.team.opponentCity = team.city;
                  sdata.team.opponentName = team.name;
                }

              }

              

            }
           }
          }
        }

        for (let team of teamRef) {
          for (let data of this.myData) { 
             if (data.player.currentTeam != null && team.id === data.player.currentTeam.id) {
               data.team['color'] = team.teamColoursHex[0];
               data.team['accent'] = team.teamColoursHex[1];
               data.team['logo'] = team.officialLogoImageSrc;
               data.team['city'] = team.city;
               data.team['name'] = team.name;
             } 
           }  
        }

        for (let schedule of this.myData) {
          for (let sdata of this.myData) {
            this.goalieFp(sdata);
            if (sdata.team != null && sdata.team.opponentId != null && schedule.player.currentTeam != null &&
              sdata.team.opponentId === schedule.player.currentTeam.id && 
              sdata.gameId === schedule.gameId) {
              sdata.team.opponentLogo = schedule.team.logo;
              sdata.team.opponentCity = schedule.team.city;
              sdata.team.opponentName = schedule.team.name;
              sdata.opponentColor = schedule.team.color;
            }
          }
        }

        if (this.myData && this.dailyStats) {
          for (let daily of this.dailyStats) {
            for (let mdata of this.myData) {

              if (daily.player.id === mdata.player.id) {
          
                mdata.player.saves = daily.stats.goaltending.saves;
                mdata.player.shotsFaced = daily.stats.goaltending.shotsAgainst;
                mdata.player.wins = daily.stats.goaltending.wins;
                mdata.player.losses = daily.stats.goaltending.losses;
                mdata.player.OvertimeLosses = daily.stats.goaltending.overtimeLosses;
                mdata.player.Shutouts = daily.stats.goaltending.shutouts;
                mdata.player.ga = daily.stats.goaltending.goalsAgainst;
                mdata.stats.fpToday = ((daily.stats.goaltending.saves * 0.2) - daily.stats.goaltending.goalsAgainst).toFixed(2);

                if (daily.stats.goaltending.saves > 0 || daily.stats.goaltending.wins === 1) {
                  // this.starterIdData.push(daily.player.ID);
                  this.startingGoaliesToday.push(daily.player.id);
                }

                if (daily.stats.goaltending.goalsAgainst === 1) {
                  mdata.player.GoalsAgainst = daily.stats.goaltending.goalsAgainst + ' goal';
                } else {
                  mdata.player.GoalsAgainst = daily.stats.goaltending.goalsAgainst + ' goals';
                }
              }

            }
          }
        }

        if (this.myData && this.fullSchedule) {
          let dPipe = new DatePipe("en-US");
              this.tweetDay = dPipe.transform(this.gameDate, 'EEEE');
              for (let fs of this.fullSchedule) {
                for (let sg of startingGoalieArray) {
                  if (this.dataService.isToday) {
                    if (this.startersDateTomorrow != tomorrow && tomorrow === dPipe.transform(fs['schedule'].startTime, 'yyyy-MM-dd')) {
                      if (fs['schedule'].awayTeam.id == sg['teamId'] || fs['schedule'].homeTeam.id == sg['teamId']) {
                        if (sg['numberOne']) {
                          this.fullFirebaseResponse[3][sg['id']].probable = true;
                        }
                      }
                    }
                  }
                  if (this.dataService.isTomorrow) {
                    if (this.startersDateTomorrow != today && today === dPipe.transform(fs['schedule'].startTime, 'yyyy-MM-dd')) {
                      if (fs['schedule'].awayTeam.id == sg['teamId'] || fs['schedule'].homeTeam.id == sg['teamId']) {
                        if (sg['numberOne']) {
                          this.fullFirebaseResponse[3][sg['id']].probable = true;
                        }
                      }
                    }
                  }
                }
              }
          for (let full of this.fullSchedule) {
            for (let btb of this.myData) {

             if (btb.player.currentTeam != null) {
              if (full['schedule'].awayTeam.id === btb.player.currentTeam.id) {
              
                if (btb.team.yesterday === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {

                  btb.team.hadGameYesterday = true;

                }
                if (btb.team.today === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {
                  btb.team.haveGameToday = true;
                }


                if (btb.team.tomorrow === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {
                  // console.log(btb.team.tomorrow, dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd'), btb.team.tomorrow === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd'))
                  btb.team.haveGameTomorrow = true;
                  // let starterWins = [];
                  // starterWins.push(btb.player.stats.goaltending.wins);
                  // btb.team.starterWins = starterWins;
                  // btb.team.starterWinsMax = Math.max(...starterWins);
                }

              }
              if (full['schedule'].homeTeam.id === btb.player.currentTeam.id) {


                if (btb.team.yesterday === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {

                  btb.team.hadGameYesterday = true;


                }
                if (btb.team.today === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {
                  btb.team.haveGameToday = true;
                }


                if (btb.team.tomorrow === dPipe.transform(full['schedule'].startTime, 'yyyy-MM-dd')) {

                  btb.team.haveGameTomorrow = true;
                }

              }
             }

              
            }
          }
        }



        for (let data of this.myData) {
          //let imgNum
          //console.log(this.dataService.isToday, 'isToday?');
          //console.log(this.dataService.isTomorrow, 'isTomorrow?');
          //stats.goaltending.savePercentage

          data.player.savePercent = data.stats.goaltending.savePercentage;

          if (this.todayStarters != null) {

            // if (this.todayStarters[data.player.id] != null) {
            //   //data.player.image = data.player.officialImageSrc;
            //   // if (this.todayStarters[data.player.id].image != null) {
            //   //   imgNum = this.todayStarters[data.player.id].image.substring(
            //   //     this.todayStarters[data.player.id].image.lastIndexOf("/") + 1, 
            //   //     this.todayStarters[data.player.id].image.lastIndexOf(".")
            //   //     );
                  
            //   //     data.player.image = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/"+imgNum+".jpg";
            //   // }
            //   //data.player.image = this.todayStarters[data.player.id].image;
            //   data.player.atHandle = this.todayStarters[data.player.id].atHandle;
            //   data.player.twitterHandle = this.todayStarters[data.player.id].twitterHandle;
            // }

            if (this.dataService.isToday && data.team != null && this.startersDate === data.team.today && 
              this.todayStarters[data.player.id] != null && data.player.saves == null && 
              data.player.shotsFaced == null && this.todayStarters[data.player.id].probable === true || 
              data.team != null && this.startersDate === data.team.today && 
              this.todayStarters[data.player.id] != null && data.player.saves == 0 && data.player.shotsFaced == 0 && 
              this.todayStarters[data.player.id].probable === true) {
              data.player.confirmed = this.todayStarters[data.player.id].confirmed;
              data.player.probable = this.todayStarters[data.player.id].probable;
              data.player.startingToday = true;
              data.player.startingTodayNow = false;

              //console.log(data.player, 'confirmed or probable today');
              this.startersData.push(data);
            } else if (this.dataService.isTomorrow && data.team != null && this.startersDateTomorrow === data.team.today && 
              this.tomorrowStarters[data.player.id] != null && data.player.saves == null && 
              data.player.shotsFaced == null && this.tomorrowStarters[data.player.id].probable === true || 
              data.team != null && this.startersDateTomorrow === data.team.today && 
              this.tomorrowStarters[data.player.id] != null && data.player.saves == 0 && data.player.shotsFaced == 0 && 
              this.tomorrowStarters[data.player.id].probable === true) {
              data.player.confirmed = this.tomorrowStarters[data.player.id].confirmed;
              data.player.probable = this.tomorrowStarters[data.player.id].probable;
              data.player.startingToday = true;
              data.player.startingTodayNow = false;

              //console.log(data.player, 'confirmed or probable tomorrow');
              this.startersData.push(data);
            }
          } else {
            console.log('firebase res not returned yet....');
          }

          if(data.team != null) {     
            if (data.team.hadGameYesterday === true) {
              //console.log(data, 'game yesterday');
              if (data.team.haveGameToday === true) {
                data.team.secondBacktoBack = " 2nd game of a Back-to-Back ";
              } else {
                data.team.secondBacktoBack = "";
              }
            } else {
              data.team.secondBacktoBack = "";
            }
  
            if (data.team.haveGameToday === true) {
              //console.log(data, 'game today');
              if (data.team.haveGameTomorrow === true) {
                data.team.firstBacktoBack = " 1st game of a Back-to-Back ";
              } else {
                data.team.firstBacktoBack = "";
              }
            }
          }

        }


        if (this.sentYesterdayData != null) {
          console.log('start sorting data from yesterday...');
          for (let yesterday of this.sentYesterdayData) {

            for (let tomdata of this.myData) {

              if (yesterday.player.saves > 1 && yesterday.player.id === tomdata.player.id) {

                console.log(yesterday.player, "played yesterday...");

                tomdata.player.finishedYesterday = false;
                tomdata.player.playedYesterday = true;
                tomdata.player.savesYesterday = yesterday.player.saves;
                tomdata.player.winsYesterday = yesterday.player.wins;
                tomdata.player.lossesYesterday = yesterday.player.losses;
                tomdata.player.saYesterday = yesterday.player.ShotsAgainst;
                tomdata.player.olYesterday = yesterday.player.OvertimeLosses;
                tomdata.player.shYesterday = yesterday.player.Shutouts;
                tomdata.player.yday = yesterday.team.day;

                if (yesterday.player.wins === 1) {
                  tomdata.player.resultYesterday = yesterday.player.FirstName + ' ' + yesterday.player.LastName + ' got the Win ' + yesterday.team.day + ' with ' + yesterday.player.saves + ' saves against ' + yesterday.player.ShotsAgainst + ' shots.'
                } else if (yesterday.player.losses === 1 || yesterday.player.OvertimeLosses === 1) {
                  tomdata.player.resultYesterday = yesterday.player.FirstName + ' ' + yesterday.player.LastName + ' got the Loss ' + yesterday.team.day + ' with ' + yesterday.player.saves + ' saves against ' + yesterday.player.ShotsAgainst + ' shots.'
                }
              }
            }
          }
        }

        if (this.myData && this.gamesToday === true) {
          if (this.startingGoaliesToday.length > 0) {
            console.log('start sorting data for starters of games in progress...');
            for (let startinprogress of this.startingGoaliesToday) {

              for (let progressdata of this.myData) {

                if (startinprogress === progressdata.player.id) {
                  console.log('starters of games that have started');
                  progressdata.player.startingToday = true;
                  progressdata.player.startingTodayNow = true;
                  this.startersData.push(progressdata);
                  //progressdata.player.startingGoalieTruth = startinprogress;

                }
              }
            }
          }


          if (this.starterIdData.length > 0) {
            console.log('start sorting data for starters matchups...');
            for (let startid of this.starterIdData) {

              for (let startdata of this.myData) {
                //startdata.stats.goaltending.gamesStarted > 1
               // this.startersDate != startdata.team.today && this.startingG[startdata.player.id] != null && this.startingG[startdata.player.id].active === true
               if (this.dataService.isToday) {
                if (startdata.player.currentTeam != null && 
                  startid === startdata.player.currentTeam.id && 
                  this.startingG[startdata.player.id] != null && 
                  this.startingG[startdata.player.id].active === true) {
                  if (startdata.team != null && this.startersDate != startdata.team.today) {

                    startdata.player.startingToday = false;
                    startdata.player.likelyStartingToday = true;
                    //console.log(startdata.player.FirstName + " " + startdata.player.LastName, "this goalie is not starting yet. but he might start.");
                    this.startersData.push(startdata);


                  }
                } else if (startdata.team != null && this.startersDate != startdata.team.today && startid === startdata.player.id) {
                  if (startdata.player.saves == null || startdata.player.saves === 0) {
                    //console.log(startdata.player, 'expected goalies from api');
                    startdata.player.startingToday = true;
                    startdata.player.startingTodayNow = false;
                    if (this.fullFirebaseResponse[1][startdata.player.id] != null) {
                      this.fullFirebaseResponse[1][startdata.player.id].probable = true;
                    }
     
                    this.startersData.push(startdata);
                  }

                } 
               }

               if (this.dataService.isTomorrow) {
                if (startdata.player.currentTeam != null && 
                  startid === startdata.player.currentTeam.id && 
                  this.startingG[startdata.player.id] != null && 
                  this.startingG[startdata.player.id].active === true) {
                  if (startdata.team != null && this.startersDateTomorrow != startdata.team.today) {

                    startdata.player.startingToday = false;
                    startdata.player.likelyStartingToday = true;
                    //console.log(startdata.player.FirstName + " " + startdata.player.LastName, "this goalie is not starting yet. but he might start.");
                    this.startersData.push(startdata);


                  }
                } else if (startdata.team != null && this.startersDateTomorrow != startdata.team.today && startid === startdata.player.id) {
                  if (startdata.player.saves == null || startdata.player.saves == '0') {
                    //console.log(startdata.player, 'expected goalies from api');
                    startdata.player.startingToday = true;
                    startdata.player.startingTodayNow = false;
                    if (this.fullFirebaseResponse[3][startdata.player.id] != null) {
                      this.fullFirebaseResponse[3][startdata.player.id].probable = true;
                    }
     
                    this.startersData.push(startdata);
                  }

                } 
               }

              }
            }
          }


          //MAKE MATCHUPS BY GAME ID OF STARTERS AND NON STARTERS

          if (this.startersData.length > 0) {
            //console.log(this.myData, 'my data');
            //console.log(this.startersData, 'my data');
            //console.log(this.starterIdData, 'starter id data');
            this.statData = this.startersData.reduce(function(r, a) {
              if(a.team != null){
                r[a.team.gameId] = r[a.team.gameId] || [];
                r[a.team.gameId].push({'location': a['player'].gameLocation, 'of': 'of', 'playerObj': a});
              }
              return r
            }, Object.create(null));
  
            this.gameGroups = Object.keys(this.statData).map((key, index) => {
                return {game: key, goalies: this.statData[key].sort((a, b) => a.location.localeCompare(b.location))};
            });

            this.showMatchups();
          }

        }

      })

  }

public showMatchups() {
    console.log(this.gameGroups, 'game Groups');
    //console.log(this.gameSkaters, 'skaters');
    this.gameGroups.forEach((data) => {
        data['goalies'][0].side = 'left';
        data['goalies'][1].side = 'right';
        data['goalies'][0].size = 'reg';
        data['goalies'][1].size = 'reg';
        data['goalies'][0].showBtb = true;
        data['goalies'][1].showBtb = true;
        let home = [];
        let away = [];
      if (data['goalies'].length === 2) {
        away.push(data['goalies'][0]);
        home.push(data['goalies'][1]);
        data['goalies'].away = away;
        data['goalies'].home = home;
      }

      if (data['goalies'].length === 3) {
        data['goalies'][2].side = 'right';
        if (data['goalies'][0].location === data['goalies'][1].location) {
          data['goalies'][0].side = 'left';
          data['goalies'][1].side = 'left';
          data['goalies'][0].size = 'small';
          data['goalies'][1].size = 'small';
          data['goalies'][0].showBtb = true;
          data['goalies'][1].showBtb = false;
          data['goalies'][2].showBtb = true;
          away.push(data['goalies'][0], data['goalies'][1]);
          home.push(data['goalies'][2]);
        } else if (data['goalies'][1].location === data['goalies'][2].location) {
          data['goalies'][1].side = 'right';
          data['goalies'][2].side = 'right';
          data['goalies'][1].size = 'small';
          data['goalies'][2].size = 'small';
          data['goalies'][0].showBtb = true;
          data['goalies'][1].showBtb = true;
          data['goalies'][2].showBtb = false;
          away.push(data['goalies'][0]);
          home.push(data['goalies'][1], data['goalies'][2]);
        }
        data['goalies'].away = away;
        data['goalies'].home = home;

        //TODO IF GAME COMPLETED HIDE IF NO WIN OR LOSS
      }

      if (data['goalies'].length === 4) {
        data['goalies'][0].side = 'left';
        data['goalies'][1].side = 'left';
        data['goalies'][2].side = 'right';
        data['goalies'][3].side = 'right';
        data['goalies'][0].size = 'small';
        data['goalies'][1].size = 'small';
        data['goalies'][2].size = 'small';
        data['goalies'][3].size = 'small';
        data['goalies'][0].showBtb = true;
        data['goalies'][1].showBtb = false;
        data['goalies'][2].showBtb = true;
        data['goalies'][3].showBtb = false;
        away.push(data['goalies'][0], data['goalies'][1]);
        home.push(data['goalies'][2], data['goalies'][3]);
        data['goalies'].away = away;
        data['goalies'].home = home;
      }

      this.loading = false;
      this.showData = this.gameGroups;
    })

     if (this.hitCount != null && this.fbService.userDetails === null) {
        this.fbService.updateCounter(this.hitCount);
     }

    //  this.dataService
    //   .sendStats(this.showData, this.myData);
  }

  public sortSkaters() {
    this.goalieSection = false; 
    this.lineSection = true; 
    this.scheduleSection = false;

    if (this.gamesToday === true) {
      this.spinTitle = 'Line Data';
      this.loading = true;
      this.dataService
        .getDailySkaters().subscribe(res => {
                let specialImgNum = null;
                //console.log(res, "Daily batter stats...");
                this.dailySkaterStats = res != null ? res['gamelogs'] : [];
                
                this.dataService
                  .getSkateStats(skaterString).subscribe(res => {

                    function teamInfo(array, teams) {
                      for (let team of teams) {
                        for (let data of array) { 
                          if (data.player['currentTeam'] != null 
                          && team['id'] === data.player['currentTeam'].id 
                          && data.player['currentTeam'].id === data.team.id 
                          || team['id'] === data.team.id) {
                            data.team.logo = team['officialLogoImageSrc'];
                            data.team.city = team['city'];
                            data.team.name = team['name'];
                            data.team.abbreviation = team['abbreviation'];
                            data.player.twitterHandle = team['twitter'];
                          }
                        }
                      }
                    }
                    
                    function removeDuplicatesBy(keyFn, array) {
                      var mySet = new Set();
                      return array.filter(function(x) {  
                          var key = keyFn(x), isNew = !mySet.has(key);
                          if (isNew) mySet.add(key);  
                          return isNew;
                      });
                    }
                  
                  let values = [];
                  const nhlTeamsArray = Object.values(this.teams);
                  if (res != null) values = res['playerStatsTotals'];
                  this.mySkaterData = removeDuplicatesBy(x => x.player.id, values);
                  //console.log(this.mySkaterData, 'my batter data');

            this.dataService
              .getSkatersToday(skaterString).subscribe(res => {
            
            this.newSkaterData = res['players'];
            for (let n of this.newSkaterData) {
              for (let old of this.myData) {
                if (old.player['currentTeam'] != null)
                  old.player['currentTeam'].lastYearTeamId = old.player['currentTeam'] != null ? old.player['currentTeam'].id : 0;
                if (n.player.id === old.player.id && n['teamAsOfDate'] != null) {
                  old.player['currentTeam'].id = n['teamAsOfDate'].id;
                  old.team.id = n['teamAsOfDate'].id;
                } 
                
                // if (old.player.id === 8550) {
                //   old.player['currentTeam'].id = 70;
                //   old.team.id = 70;
                //   old.team.abbreviation = 'NO';
                // }
              }
            }
            teamInfo(this.mySkaterData, nhlTeamsArray);
            // this.nflOffenseLoading = false;
        });

                      if (this.skaterIdData.length > 0 || this.noGamesToday === true) {
                        if (this.mySkaterData && this.gameSkaters) {
                          for (let gb of this.gameSkaters) {
                            for (let data of this.mySkaterData) {
                              data.player.gameLocation = "none";
                              if (gb.playerID === data.player.id) {
                                data.gameId = gb.gameID;
                                data.score = gb.score;
                                data.gameStatus = gb.status;
                                data.starterTeam = gb.team;
                                data.sStatus = gb.scheduleStatus;
                                data.order = gb.position;
                                this.skaterFp(data);

                                if (gb.status !== "UNPLAYED") {
                                  data.team.currentPeriod = gb.score['currentPeriod'];
                                  data.team.currentIntermission = gb.score['currentIntermission'];
                                }
                                //console.log(game, 'is game over?');
                                if (gb.status === "COMPLETED" 
                                  || gb.status === "COMPLETED_PENDING_REVIEW") {
                                  data.team.isGameOver = true;
                                  data.team.isGameInProgress = false;
                                  data.team.isGameUnplayed = false;
                                  
                                } else {
                                  data.team.isGameInProgress = true;
                                  data.team.isGameUnplayed = true;
                                  data.team.isGameOver = false;
                                }

                                if (gb.scheduleStatus === "POSTPONED") {
                                  data.postponed = true;
                                }

                                if (data.player.officialImageSrc != null) {
                                  specialImgNum = data.player.officialImageSrc.substring(
                                    data.player.officialImageSrc.lastIndexOf("/") + 1, 
                                    data.player.officialImageSrc.lastIndexOf(".")
                                    );
                                    
                                  data.player.officialImageSrc = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/"+specialImgNum+".jpg";
                                }
                              }
                            }
                          }
                          //console.log('start sorting data for real gameID by PitcherID...');
                        
                          if (this.mySkaterData && this.dailySchedule) {
                            let gameDay = null;
                            let originalStart = null;
                          // console.log('start sorting data for daily schedule...');
                            for (let schedule of this.dailySchedule) {
                              for (let sdata of this.mySkaterData) {
                                gameDay = new Date(this.gameDate);
                                originalStart = new Date(schedule.schedule.startTime);
                                
                                if (schedule.schedule.awayTeam != null && 
                                  schedule.schedule.homeTeam != null) {
                                    // schedule.schedule.scheduleStatus != "POSTPONED" && 
                                  if (gameDay.getDay() === originalStart.getDay()) {

                                    if (schedule.schedule.awayTeam.id === sdata.starterTeam) {
                                      sdata.sStatus = schedule.schedule.scheduleStatus;
                                      sdata.player.gameTime = schedule.schedule.startTime;
                                      sdata.team.gameField = schedule.schedule.venue.name;
                                      //sdata.gameId = schedule.id;
                                      sdata.player.gameLocation = "away";
                                      sdata.team.opponent = schedule.schedule.homeTeam.abbreviation;   
                                      sdata.team.opponentId = schedule.schedule.homeTeam.id;

                                    }
                                    if (schedule.schedule.homeTeam.id === sdata.starterTeam) {
                                      sdata.sStatus = schedule.schedule.scheduleStatus;
                                      sdata.player.gameTime = schedule.schedule.startTime;
                                      sdata.team.gameField = schedule.schedule.venue.name;
                                      //sdata.gameId = schedule.schedule.id;
                                      sdata.player.gameLocation = "home";
                                      sdata.team.opponent = schedule.schedule.awayTeam.abbreviation;
                                      sdata.team.opponentId = schedule.schedule.awayTeam.id;
                                    }

                                  }
                                    
                                } 
                              
                              } 
                            }
                          }

                          for (let team of teamRef) {
                            for (let data of this.mySkaterData) { 
                                if (team.id === data.starterTeam) {
                                  data.team.color = team.teamColoursHex[0];
                                  data.team.accent = team.teamColoursHex[1];
                                  data.team.logo = team.officialLogoImageSrc;
                                  data.team.city = team.city;
                                  data.team.name = team.name;
                                  data.team.twitter = team.twitter;
                                }
                              }  
                          }
                        }

                        if (this.mySkaterData && this.dailySchedule) {
                          //console.log('start sorting data for pitching opponent...');
                          for (let schedule of this.mySkaterData) {
                            for (let sdata of this.mySkaterData) {
                              if (sdata.team.opponentId === schedule.team.id && 
                                sdata.gameId === schedule.gameId) {
                                sdata.player.pitchingOpponent = schedule.player.firstName + ' ' + schedule.player.lastName;
                                sdata.team.opponentLogo = schedule.team.logo;
                              }
                            }
                          }
                        }

                        for (let gb of this.gameSkaters) {
                          for (let data of this.mySkaterData) {
                            if (gb.playerID === data.player.id) {
                              if (gb.status != "UNPLAYED") {
                                if (data.player.gameLocation === 'home') {
                                  data.team.teamScore = gb.score['homeScoreTotal'];
                                  data.team.opponentScore = gb.score['awayScoreTotal'];
                                } else if (data.player.gameLocation === 'away') {
                                  data.team.teamScore = gb.score['awayScoreTotal'];
                                  data.team.opponentScore = gb.score['homeScoreTotal'];
                                }
                              }
                            }
                            
                            if (data.team.opponentId === gb.team && 
                              data.gameId === gb.gameID) {
                                data.player.po = gb.name;
                            }
                          }
                        }

                        if (this.mySkaterData && this.dailySkaterStats) {
                        // console.log('start sorting data for daily stats...');
                          for (let daily of this.dailySkaterStats) {
                            for (let mdata of this.mySkaterData) {

                              if (daily.player.id === mdata.player.id) {
                                //console.log(daily.game, 'get game info by player id')
                                mdata.gameId = daily.game.id;
                                mdata.stats.assistsToday = daily.stats.scoring.assists ? daily.stats.scoring.assists : 0;
                                mdata.stats.goalsToday = daily.stats.scoring.goals ? daily.stats.scoring.goals : 0;
                                mdata.stats.iceTimeToday = daily.stats.shifts != null ? this.makeMinutes(daily.stats.shifts.timeOnIceSeconds) : 0;
                                mdata.stats.sogToday = daily.stats.skating.shots ? daily.stats.skating.shots : 0;
                                mdata.stats.blocksToday = daily.stats.skating.blockedShots ? daily.stats.skating.blockedShots : 0;
                                mdata.stats.hitsToday = daily.stats.skating.hits ? daily.stats.skating.hits : 0;
                                mdata.stats.fpToday = mdata.stats.goalsToday * 3 + mdata.stats.assistsToday * 2 + mdata.stats.sogToday + mdata.stats.blocksToday;
                                //how to get shootout goals
                              }

                            }
                          }

                          this.groupSkaters();
                        } else {
                          this.groupSkaters();
                        }
                      }
                      this.loading = false;
                    },
                    (err: HttpErrorResponse) => {
                      if (err instanceof Error) {
                        console.log('api error', err.error.message);
                        // client-side error
                        this.loading = false;
                        this.errMessage = `An error occured ${err.error.message}`;
                      } else {
                        this.loading = false;
                        console.log('api error', err.message);
                        this.errMessage = `${err.status}. Sorry :( Please Try again.`;
                      }
                    }
                  );
              },
              (err: HttpErrorResponse) => {
                if (err instanceof Error) {
                  console.log('api error', err.error.message);
                  // client-side error
                  this.loading = false;
                  this.errMessage = `An error occured ${err.error.message}`;
                } else {
                  this.loading = false;
                  console.log('api error', err.message);
                  this.errMessage = `${err.status}. Sorry :( Please Try again.`;
                }
              }
            );

        } else {
          console.log('No games then no daily stats either. :(');
        } 
  }

  public groupSkaters() {
    this.statSkaterData = this.mySkaterData.reduce(function(r, a) {
      if(a.team != null){
        r[a.starterTeam] = r[a.starterTeam] || [];
        r[a.starterTeam].push({'order': a.order, 'gid': a.gameId, 'location': a['player'].gameLocation, 'of': 'of', 'playerObj': a});
      }
      return r
    }, Object.create(null));

    this.gameSkaterGroups = Object.keys(this.statSkaterData).map((key, index) => {
        return {id: this.statSkaterData[key][0].gid != null ?  this.statSkaterData[key][0].gid : 
           this.statSkaterData[key][1].gid != null ?  this.statSkaterData[key][1].gid : 
           this.statSkaterData[key][2].gid, game: key, skaters: this.statSkaterData[key].sort((a, b) => a.order.localeCompare(b.order))};
    });

    this.showSkaterMatchups();
  }

  public showSkaterMatchups() {
    this.loading = false;
    this.showSkaterData = this.gameSkaterGroups.sort((a, b) => {
      if (a.id <= b.id) return -1
      else if (a.id >= b.id) return 1
      else return 0
    });
    console.log(this.showSkaterData, 'skater groups');   
  }

  public makeMinutes(time) {
    return Math.floor(time / 60);
  }

  public skaterFp (player) {
    player.stats.hits = player.stats.skating.hits; 
    player.stats.sog = player.stats.skating.shots ? player.stats.skating.shots : 0;
    player.stats.blocks = player.stats.skating.blockedShots ? player.stats.skating.blockedShots : 0;
    player.stats.fp = (player.stats.scoring.goals * 3 + player.stats.scoring.assists * 2) + (player.stats.sog + player.stats.blocks);
    player.stats.fpa = Math.floor(player.stats.fp / player.stats.gamesPlayed);
  }

  public goalieFp (player) {
    player.stats.fp = ((player.stats.goaltending.saves * 0.2) - player.stats.goaltending.goalsAgainst).toFixed(2);
    player.stats.fpa = Math.floor(player.stats.fp / player.stats.gamesPlayed);
  }

  ngOnInit() {
    if (this.testBrowser) {
      if (window.innerWidth < 700) { 
        this.mobile = true;
      }
      
      if (this.sentData === undefined) {
        this.loadData();
        this.cdr.detectChanges();
        this.fbService.getHits()
          .subscribe(res => {
              //console.log(res[0]['hits'], 'ngOnInit hit count...');
              this.hitCount = res[0]['hits'];
          });

        // get our data every subsequent 10 minutes
        const MILLISECONDS_IN_TEN_MINUTES = 600000;
        interval(MILLISECONDS_IN_TEN_MINUTES)
          .subscribe(() => {
            if (this.gamesToday === true) {
              this.dataService
                .getDaily().subscribe(res => {
                  console.log(res, "Daily stats updated!");
                  if (res != null) this.dailyStats = res['gamelogs'];

                  if (this.myData && this.dailyStats) {
                    console.log('start sorting data for daily stats...');
                    for (let daily of this.dailyStats) {
                      for (let mdata of this.myData) {

                        if (daily.player.id === mdata.player.id) {

                          mdata.player.saves = daily.stats.goaltending.saves;
                          mdata.player.shotsFaced = daily.stats.goaltending.shotsAgainst;
                          mdata.player.wins = daily.stats.goaltending.wins;
                          mdata.player.losses = daily.stats.goaltending.losses;
                          mdata.player.OvertimeLosses = daily.stats.goaltending.overtimeLosses;
                          mdata.player.Shutouts = daily.stats.goaltending.shutouts;
                          mdata.player.ga = daily.stats.goaltending.goalsAgainst;

                          if (daily.stats.goaltending.saves > 0 || daily.stats.goaltending.wins === 1) {
                            // this.starterIdData.push(daily.player.ID);
                            this.startingGoaliesToday.push(daily.player.id);
                          }

                          if (daily.stats.goaltending.goalsAgainst === 1) {
                            mdata.player.GoalsAgainst = daily.stats.goaltending.goalsAgainst + ' goal';
                          } else {
                            mdata.player.GoalsAgainst = daily.stats.goaltending.goalsAgainst + ' goals';
                          }
                        }

                      }
                    }
                  }
                })

            } else {
              console.log('No games then no daily stats either. :(');
            }
          });

      } else {     
        this.loading = false;
        this.showTomorrow = this.sentTomorrowData;
        this.showData = this.sentData;
        console.log(this.showTomorrow, "show tomorrow");
        this.gameDate = this.showData["0"].team.today;
      }
    }
  }

  ngAfterViewInit() {            
    this.vc.first.nativeElement.focus();
  }


  public saveStarts() {
    if (this.stats === false) {
      console.log('This a good state to save!!');
      console.log(this.fullFirebaseResponse, 'the full firebase response to send back to fb for update...');
      this.fbService
        .addData(this.fullFirebaseResponse);
    } else {
      console.log('you need to refresh the goalies before saving... Important');
    }
  }

  public setGoalieId() {
     this.newGoalie = {
      [this.goalieID]: {
        confirmed: false,
        name: null,
        probable: false,
        image: null,
        atHandle: null,
        twitterHandle: null
      }
    };

    console.log(this.newGoalie, 'save this goalie');
    this.goalieIdSet = true;
  }

  public addGoalie() {
    this.fullFirebaseResponse[1][this.goalieID] = this.newGoalie[this.goalieID];
    this.fullFirebaseResponse[3][this.goalieID] = this.newGoalie[this.goalieID];
    console.log(this.newGoalie, 'goalie updated');
    console.log(this.fullFirebaseResponse, 'added new goalie ready to save to fb....');   
  }

  public updateTodayStarters() {
    this.fullFirebaseResponse[0]['todayDate'] = this.fullFirebaseResponse[2]['tomorrowDate'];
    this.fullFirebaseResponse[1] = this.fullFirebaseResponse[3];
    console.log(this.fullFirebaseResponse, 'moved tomorrow starts to today...');
  }

  public showTodayStarters() {
    this.stats = true;
    for (let info of this.myData) {
      if (this.fullFirebaseResponse[1][info.player.id] != null) {
        if (this.fullFirebaseResponse[1][info.player.id].confirmed === false && this.fullFirebaseResponse[1][info.player.id].probable === false) {

          this.fullFirebaseResponse[1][info.player.id].filterOutStarters = true;
          //console.log(this.fullFirebaseResponse[1][info.player.id], "not starting today...");
        }
      }

      if (this.fullFirebaseResponse[3][info.player.id] != null) {
        if (this.fullFirebaseResponse[3][info.player.id].confirmed === false && this.fullFirebaseResponse[3][info.player.id].probable === false) {

          this.fullFirebaseResponse[3][info.player.id].filterOutStarters = true;
          //console.log(this.fullFirebaseResponse[3][info.player.ID], "not starting tomorrow...");
        }
      }
    }
  }

  public selectAll() {
    for (let info of this.myData) {
      if (this.fullFirebaseResponse[3][info.player.id] != null) {
        this.fullFirebaseResponse[3][info.player.id].confirmed = false;
        this.fullFirebaseResponse[3][info.player.id].probable = false;
        //console.log(this.fullFirebaseResponse, "make all starters false");
      }
    }
  }

  public reset() {
    for (let info of this.myData) {
      if (this.fullFirebaseResponse[1][info.player.id] != null) {
        this.fullFirebaseResponse[1][info.player.id].confirmed = false;
        this.fullFirebaseResponse[1][info.player.id].probable = false;
        //console.log(this.fullFirebaseResponse, "make all starters false");
      }
    }
  }

  public authorize(event: object) {
    this.modalType = 'twitter';
    this.title = 'Twitter Updates -';
    this.isOpen = true;
    this.submitting = true;
    let headers = new HttpHeaders().set('Content-Type', 'application/X-www-form-urlencoded');

    this.http.post('/authorize', {headers}).subscribe((res) => {
      this.openModal(event['player'], headers, event['area']);
    });
  }

  public openModal(item, headers, area) {
    this.area = area;
    this.type = 'nhl';
    this.selectedPlayer = null;
    this.noPosts = '';
    this.selectedPlayer = item;
    //this.gaService.eventEmitter("nba player info "+(data.playerObj ? data.playerObj.player.lastName : data.player.lastName), "nbatwitter", "tweet", "click", 10);
    let searchterm = null;
    searchterm = 'query=' + item.player.lastName + ' ' + (item.player.twitterHandle ?  item.player.twitterHandle : this.teams[item.team.abbreviation].twitter);
    this.image = item.player.officialImageSrc;
    this.name = item.player.firstName + ' ' + item.player.lastName +' - '+ item.player.primaryPosition +' | #'+ item.player.jerseyNumber;

    this.http.post('/search', searchterm, {headers}).subscribe((res) => {
      this.submitting = false;
      this.tweetsData = res['data'].statuses;
      if (this.tweetsData.length === 0) {
        this.noPosts = "No Tweets.";
      }
    });
    //this.gaService.eventEmitter("nhl goalie player info "+item.player.lastName, "nhltwitter", "tweets", "click", 10);
  }

  public openLastweek(event, data) {
    this.modalType = 'lw';
    //this.title = 'NHL Starting Goalies | The Hot List! | {{sentLastweek | date:'shortDate'}} - {{sentYesterday | date:'shortDate'}}';
    this.isOpen = true;
    this.submitting = true;
    if (this.sentHotData === undefined) {

      // this.loadLastweek();

    } else {
      console.log('using saved hot list data :)')
      setInterval(() => {
        this.loading = false;
        this.showData = this.sentHotData;

      }, 300)

    }
    
    this.dataService
      .getLastweekGameId().subscribe(res => {
        console.log(res['games'], "scheduled games for lastweek...");
        //this.lastweekSchedule = res['games'];


        forkJoin(
            res['games'].map(
              g =>
              this.http.get('https://api.mysportsfeeds.com/v2.1/pull/nhl/2020-playoff/games/'+ g.schedule.id +'/boxscore.json?playerstats=Sv,GA,GAA,GS,SO,MIN,W,L,SA,OTL,OTW', {headers})
              //.map(response => response.json())
            )
          )
          .subscribe(res => {
            //console.log(res, 'making several calls by GAME ID for starting lineups...');

            let i;
            let i2;
            let i3;
            let res2;
            let res3;
            let myDate;

            res.forEach((item, index) => {
              i = index;
              //console.log(res[i], 'got box score data for away team!');
              //console.log(res[i]['games'].game.date, 'looking for date...');
             if (res[i] != null) {

             
              res2 = res[i]['stats'].away.players;
              res3 = res[i]['stats'].home.players;

              //this.gameTime =  res[i]['gamestartinglineup'].game.date;
              res2.forEach((item, index) => {

                i2 = index;
                res2[i2].player.city = res[i]['game'].awayTeam.abbreviation;
                //res2[i2].player.team = res[i]['game'].awayTeam.name;
                res2[i2].player.teamId = res[i]['game'].awayTeam.id;
                //console.log(res[i]['games'], 'game score data');
                let dPipe = new DatePipe("en-US");
                myDate = dPipe.transform(res[i]['game'].startTime, 'MMM d');

                if (res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.wins === 1) {
         
                  res2[i2].player.opponent = {date: myDate, desc: '(W) @ ' + res[i]['game'].homeTeam.abbreviation + ' GA: ' + res2[i2].playerStats[0].goaltending.goalsAgainst}
                  
                }
                if (res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.losses === 1) {
                  
                  res2[i2].player.opponent = {date: myDate, desc: '(L) @ ' + res[i]['game'].homeTeam.abbreviation + ' GA: ' + res2[i2].playerStats[0].goaltending.goalsAgainst}
               
                }
                if (res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.overtimeLosses === 1) {
                  
                  res2[i2].player.opponent = {date: myDate, desc: '(L) @ ' + res[i]['game'].homeTeam.abbreviation + ' GA: ' + res2[i2].playerStats[0].goaltending.goalsAgainst}
                 
                }

                if (res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.wins > 0 && res2[i2].player.id != '9072' || res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.losses > 0 && res2[i2].player.id != '9072' || res2[i2].playerStats.length > 0 && res2[i2].playerStats[0].goaltending.overtimeLosses > 0 && res2[i2].player.id != '9072') {
                  this.starterStatData.push(res2[i2]);
                  //console.log(res2[i2], 'got player stats for away goalie stats!'); 

                }


              });

              res3.forEach((item, index) => {

                i3 = index;
                
                res3[i3].player.city = res[i]['game'].homeTeam.abbreviation;
                //res3[i3].player.team = res[i]['game'].homeTeam.name;
                res3[i3].player.teamId = res[i]['game'].homeTeam.id;
                if (res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.wins === 1) {
                  
                  res3[i3].player.opponent = {date: myDate, desc: '(W) ' + res[i]['game'].awayTeam.abbreviation+ ' GA: ' + res3[i3].playerStats[0].goaltending.goalsAgainst}
                  
                }
                if (res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.losses === 1) {
                  
                  res3[i3].player.opponent = {date: myDate, desc: '(L) ' + res[i]['game'].awayTeam.abbreviation+ ' GA: ' + res3[i3].playerStats[0].goaltending.goalsAgainst}
                 
                }
                if (res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.overtimeLosses === 1) {
                  
                  res3[i3].player.opponent = {date: myDate, desc: '(L) ' + res[i]['game'].awayTeam.abbreviation+ ' GA: ' + res3[i3].playerStats[0].goaltending.goalsAgainst}
                  
                }

                //res3[i3].player.opponent = res[i]['games'].game.awayTeam.Abbreviation;
                if (res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.wins > '0' && res3[i3].player.id != '9072' || res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.losses > '0' && res3[i3].player.id != '9072' || res3[i3].playerStats.length > 0 && res3[i3].playerStats[0].goaltending.overtimeLosses > '0' && res3[i3].player.id != '9072') {
                  this.starterStatData.push(res3[i3]);
                  //console.log(res3[i3], 'got player stats for home goalie!');
                }

              });
            }
            });

            this.sortLwData();

          });
      })
  }

  public sortLwData() {

    for (let info of this.sentAllData) {

      for (let data of this.starterStatData) {
        //console.log(info, 'looking for image');

        if (info.player.id === data.player.id) {
          //console.log(info, 'looking for image IDS Match!!')
          data.player.image = info.player.image;
        }

      }
    }
    let opponents = [];
    this.showData = this.starterStatData.reduce(function(hash) {
      //console.log(hash, 'hash');
      return function(r, a) {
        //console.log(a, 'this is a');
        let key = a.player.id;
        if (!hash[key]) {
          hash[key] = { wins: 0, losses: 0, otl: 0, name: a.player.firstName + ' ' + a.player.lastName, id: a.player.id, opponents: [], team: a.player.teamId, ga: 0, sa: 0, sv: 0, svpercent: 0, hot: false, image: a.player.image };
          r.push(hash[key]);
        }
        hash[key].wins += parseInt(a.playerStats[0].goaltending.wins);
        hash[key].losses += parseInt(a.playerStats[0].goaltending.losses);
        hash[key].otl += parseInt(a.playerStats[0].goaltending.overtimeLosses);
        hash[key].ga += parseInt(a.playerStats[0].goaltending.goalsAgainst);
        hash[key].sa += parseInt(a.playerStats[0].goaltending.shotsAgainst);
        hash[key].sv += parseInt(a.playerStats[0].goaltending.saves);
        hash[key].svpercent = Math.round((hash[key].sv * 100) / hash[key].sa);

        if (hash[key].svpercent < 95) {
          hash[key].hot = false;
        } else {
          hash[key].hot = true;
        }

        hash[key].opponents.push(a.player.opponent);

        return r;
      };

    }(Object.create(null)), []);
    this.loading = false;
    console.log(this.showData, 'show reduce array!');
    this.dataService
      .sendHotStats(this.showData);
  }

  public openLogin(event) {
    console.log(event, 'key code');
    this.isOpen = true;
    this.modalType = 'login';
    this.title = this.fbService.userDetails == null ? 'Login to Edit' : 'Logout after edit is saved';
  }

}


// @Component({
//   selector: 'info',
//   template: `<i (click)="close()" class="material-icons close">close</i><br />
// <span style="color: #e74c3c;">back</span><span style="color: #ccc;"> to back</span><span> = The first game of a back to back scheduled game.</span><br />
// <span style="color: #ccc;">back to </span><span style="color: #e74c3c;">back</span><span> = The second game of a back to back scheduled game.</span> <br />
// <span class="green-dot"></span> = This game is in progress. <br />
// <span>Click on player image for twitter updates!</span>`,
//   styles: [`.close { float:right; cursor:pointer; font-size: 20px; } .green-dot { height: 10px; width: 10px; background:#2ecc71; border-radius: 50%; display: inline-block; }`]
// })

// export class Info {
//   constructor(public snackBar: MatSnackBar) {}
//   close() {
//     this.snackBar.dismiss();
//   }
// }
