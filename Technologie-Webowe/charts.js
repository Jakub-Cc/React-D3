import * as d3 from 'd3';
import moment from 'moment';
import d3tip from 'd3-tip';

class Charts
{
  static BarChart(contenerId)
  {
    const svg = d3.select(contenerId);
    svg.selectAll('g').remove();
    svg.selectAll('bar').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
    .range([0, width])
    .padding(0.25);

    const y = d3.scaleLinear()
    .range([height, 0]);

    const tip = d3tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `<strong>Frequency:</strong> <span style='color:red'>${d.frequency}</span>
    <br/><strong>Length:</strong> <span style='color:red'>${d.length}</span>`);

    g.call(tip);

    d3.tsv(`${process.env.PUBLIC_URL}/data_tweet_length_freq.tsv`,
    d => ({ length: d.length, frequency: +d.frequency }),
    (error, dane) =>
    {
      const data = dane.slice();
      x.domain(data.map(d => d.length));
      y.domain(d3.extent(data, d => d.frequency));

      const xAxis = d3.axisBottom(x).tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
        110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250]);
      const yAxis = d3.axisLeft(y).ticks(20);

      g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);
      // .select('.domain')
      // .remove();

      g.append('g')
      .call(yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

      g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.length))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.frequency))
      .attr('height', d => height - y(d.frequency))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
    });
  }

  static LineChart(dane, contenerId)
  {
    const svg = d3.select(contenerId);
    // podpinanie i tworzenie nowego elementu svg do wybranego kontenera
    // const svg = d3.select(contener).append('svg').attr('width', 960).attr('height', 500);

    // usuwanie poprzednich wykresow, nie wiem czy wszstkie selecty potrzebne
    svg.selectAll('.domain').remove();
    svg.selectAll('g').remove();
    svg.selectAll('path').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const data = dane.slice();
    const x = d3.scaleTime().rangeRound([0, width]);
    x.domain(d3.extent(data, d => d.date));

    const y = d3.scaleLinear().rangeRound([height, 0]);
    y.domain(d3.extent(data, d => d.close));

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.close));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .select('.domain')
      .remove();

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    const tip = d3tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .direction('nw')
    .html(d => `<strong>Date:</strong> <span style='color:red'>${moment(d.date).format('YYYY-MM-DD')}</span>
    <br/><strong>Value:</strong> <span style='color:red'>${d.close}</span>`);

    g.call(tip);
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);


    g.selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 2)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.close))
        .attr('stroke-with', 0.5)
        .attr('stroke', 'black')
        .attr('fill', 'green')
        .attr('transition', 'stroke-width 250ms linear')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  }
}

export default Charts;

