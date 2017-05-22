import moment from 'moment';

class downloadData
{
  static downloadFromBitCoinApi(startDate = '2016-09-01', endDate = moment().format('YYYY-MM-DD'))
  {
    const url = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`;
    return fetch(url)
    .then(response => response.json())
     .then((json) =>
      {
       const wynik = Object.keys(json.bpi)
          .map(date => ({ date: new Date(date), close: json.bpi[date] }));
       return wynik;
     });
  }
}
export default downloadData;
