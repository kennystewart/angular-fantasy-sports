import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderBy', pure: false})
export class OrderBy implements PipeTransform {
 

transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (field === 'mlb') {
        if (a['gameId'] <= b['gameId']) {
          return -1;
        } else if (a['gameId'] >= b['gameId']) {
          return 1;
        } else {
          return 0;
        }
      } else if (field === 'nfl') {
        if (a.offensePlayers[0].playerObj['gameId'] <= b.offensePlayers[0].playerObj['gameId']) {
            return -1;
          } else if (a.offensePlayers[0].playerObj['gameId'] >= b.offensePlayers[0].playerObj['gameId']) {
            return 1;
          } else {
            return 0;
          }
      }
      
    });
    return array;
  }
}