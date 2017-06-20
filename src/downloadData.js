import moment from 'moment';

class downloadData
{
  static downloadFromBitCoinApi(startDate = '2016-09-01', endDate = moment().format('YYYY-MM-DD'))
  {
    const url = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`;

    try
    {
      const pom = fetch(url).catch((e) => { console.log(`kupa ${e}`); });
      return pom
     .then(response => response.json())
     .then((json) =>
      {
       const wynik = Object.keys(json.bpi)
          .map(date => ({ date: new Date(date), close: json.bpi[date] }));
       return wynik;
     });
    }
    catch (err)
    {
      console.log('downloadData error');
      console.log(err);
    }
    return null;
  }
}
export default downloadData;
