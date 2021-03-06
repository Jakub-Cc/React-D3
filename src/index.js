import React from 'react';
import ReactDOM from 'react-dom';
// import * as d3 from 'd3';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './index.css';
import Charts from './charts';
import downloadData from './downloadData';

class Main extends React.Component
{

  constructor(props)
{
    super(props);
    this.state = {
      startDate: moment('2016-09-01'),
      endDate: moment(),
    };
    this.startDateHandleChange = this.startDateHandleChange.bind(this);
    this.endDateHandleChange = this.endDateHandleChange.bind(this);
  }

  componentDidMount()
  {
    Charts.helperSi('#area4');
    try
    {
      Charts.SpinerShow('#area1');
      downloadData.downloadFromBitCoinApi()
      .then((wynik) =>
      {
        Charts.LineChart(wynik, '#area1');
       // Charts.LineChart(wynik, '#area3');
        // Charts.LineChart(wynik, '#area5');
        Charts.SpinerFade('#area1', 0);
      })
      .catch((e) => { console.log(`wywalilo sie ${e}`); Charts.SpinerFade('#area1', 0); });
    }
    catch (err)
    {
      console.log('err');
      console.log(err);
    }

    Charts.BarChart('#area2');
    Charts.BubleChart({ data: 'nic' }, '#area3');
    Charts.SpinerShow('#area5');
    Charts.SpinerFade('#area5', 12000);
  }

  startDateHandleChange(date)
  {
    this.setState({ startDate: date });
  }

  endDateHandleChange(date)
  {
    this.setState({ endDate: date });
  }

  downloadClick()
 {
    Charts.SpinerShow('#area1');
    downloadData.downloadFromBitCoinApi(this.state.startDate.format('YYYY-MM-DD'), this.state.endDate.format('YYYY-MM-DD'))
    .then((wynik) => { Charts.LineChart(wynik, '#area1'); Charts.SpinerFade('#area1', 0); })
    .catch((e) => { console.log(`klik i wywalilo ${e}`); Charts.SpinerFade('#area1', 0); });
  }

  render()
{
    return (
      <div className="main">
        <Tabs forceRenderTabPanel >
          <TabList>
            <Tab>Wykres BitCoin</Tab>
            <Tab>Wykres Rozkładu Normalnego</Tab>
            <Tab>Wykres 3</Tab>
            <Tab>Wykres 4</Tab>
            <Tab>Wykres 5</Tab>
          </TabList>
          <TabPanel>
            <svg id="area1" ref={(c) => { this.svg = c; }} width="960" height="500" />
            <br />
            <DatePicker
              className="form-control"
              dateteFormat="YYYY/MM/DD"
              selected={this.state.startDate}
              selectsStart
              startDate={this.state.startDate}
              minDate={moment('2016-09-01')}
              maxxDate={moment().subtract(2, 'days')}
              endDate={this.state.endDate}
              onChange={this.startDateHandleChange}
            />
            <DatePicker
              className="form-control"
              dateFormat="YYYY/MM/DD"
              selected={this.state.endDate}
              minDate={moment('2016-09-01').add(2, 'days')}
              maxDate={moment()}
              selectsEnd
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.endDateHandleChange}
            />
            <input
              type="button" className="btn btn-default" value="Pobierz wykres"
              onClick={() => this.downloadClick()}
            />
          </TabPanel>
          <TabPanel>
            <svg id="area2" ref={(d) => { this.svg = d; }} width="960" height="500" />
            <br />
                 Chwilowo wykres rozkładu normalnego,
                 później wykres rozkładu długości wiadomości na twitterze.
          </TabPanel>
          <TabPanel>
            <svg
              id="area3" ref={(d) => { this.svg = d; }} width={window.innerWidth}
              height="1000" textAnchor="middle"
            />
            <br />
              Chwilowo wykres bąbelkowy hierarchi klasy flare (http://flare.prefuse.org/).
          </TabPanel>
          <TabPanel>
            <svg
              id="area4" ref={(d) => { this.svg = d; }} width="1300" height="500"
            />
            <br />
              Tu bedzie wykres nr 4, tego samego typu co wykres nr 3, tylko inne dane
            <br />
              Chwilowo grafiki pomocnicze, do projektu rozpoznawania obrazow, na przedmiot SI
          </TabPanel>
          <TabPanel>
            <svg id="area5" ref={(d) => { this.svg = d; }} width="960" height="500" />
            <br />
              Tu bedzie wykres nr 5, tego samego typu co wykres nr 3, tylko inne dane
            <br />
              Chwilowo test spinera ladowania z okreslonym czasem trwania.
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root'),
);
