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

  static Spiner(contenerId)
  {
    const svg = d3.select(contenerId);

    const wheel = d3.component('g')
  .create((selection) =>
{
    const minRadius = 4;
    const maxRadius = 10;
    const numDots = 10;
    const wheelRadius = 40;
    // const rotation = 0;
    // const rotationIncrement = 3;

    const radius = d3.scaleLinear()
    .domain([0, numDots - 1])
    .range([maxRadius, minRadius]);

    const angle = d3.scaleLinear()
    .domain([0, numDots])
    .range([0, Math.PI * 2]);

    selection
      .selectAll('circle').data(d3.range(numDots))
      .enter().append('circle')
        .attr('cx', d => Math.sin(angle(d)) * wheelRadius)
        .attr('cy', d => Math.cos(angle(d)) * wheelRadius)
        .attr('r', radius);
  })
  .render((selection, d) =>
{
    selection.attr('transform', `rotate(${d})`);
  });

    const spinner = ((() =>
{
      const timer = d3.local();
      return d3.component('g')
    .create((selection, d) =>
{
      timer.set(selection.node(), d3.timer((elapsed) =>
{
        selection.call(wheel, elapsed * d.speed);
      }));
    })
    .render((selection, d) =>
{
      selection.attr('transform', `translate(${d.x},${d.y})`);
    })
    .destroy((selection, d) =>
{
      timer.get(selection.node()).stop();
      return selection
        .attr('fill-opacity', 1)
        .transition().duration(3000)
          .attr('transform', `translate(${d.x},${d.y}) scale(10)`)
          .attr('fill-opacity', 0);
    });
    })());

    const app = d3.component('g')
  .render((selection, d) =>
{
    selection
      .call(spinner, {
        x: d.width / 2,
        y: d.height / 2,
        speed: 0.2,
      });
  });

    const width = 960;
    const height = 500;

    svg.call(app, {
      width,
      height,
      loading: true,
    });
  }

  static BubleChart(dane, contenerId)
  {
    const svg = d3.select(contenerId);
    svg.select('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const format = d3.format(',d');
    const color = d3.scaleOrdinal(d3.schemeCategory20c);

    const pack = d3.pack()
    .size([width, height])
    .padding(1.5);

    d3.csv('flare.csv', (d) =>
    {
      d.value = +d.value;
      if (d.value) return d;
    }, (error, classes) =>
    {
      if (error) throw error;
      const root = d3.hierarchy({ children: classes })
      .sum(d => d.value)
      .each((d) =>
      {
        if (id = d.data.id)
        {
          var id,
            i = id.lastIndexOf('.');
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

      const node = svg.selectAll('.node')
      .data(pack(root).leaves())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

      node.append('circle')
      .attr('id', d => d.id)
      .attr('r', d => d.r)
      .style('fill', d => color(d.package));

      node.append('clipPath')
      .attr('id', d => `clip-${d.id}`)
      .append('use')
      .attr('xlink:href', d => `#${d.id}`);

      node.append('text')
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .selectAll('tspan')
      .data(d => d.class.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 10)
      .attr('font-size', '10px')
      .text(d => d);

      node.append('title')
      .text(d => `${d.id}\n${format(d.value)}`);
    });
  }

  static LineChart(dane, contenerId)
  {
    const svg = d3.select(contenerId);
    // podpinanie i tworzenie nowego elementu svg do wybranego kontenera
    // const svg = d3.select(contener).append('svg').attr('width', 960).attr('height', 500);
    svg.select('*').remove();

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
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
  }
}

export default Charts;

