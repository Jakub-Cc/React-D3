import React from 'react';

// do testowania wywolan
class TestLifeCycle extends React.Component
{
  constructor(props)
  {
    super(props);
    console.log('constructor');
  }
  componentWillMount() { console.log('componentWillMount'); }
  componentDidMount() { console.log('componentDidMount'); }
  componentWillReceiveProps() { console.log('componentWillReceiveProps'); }
  shouldComponentUpdate() { console.log('shouldComponentUpdate'); }
  componentWillUpdate() { console.log('omponentWillUpdate'); }
  componentDidUpdate() { console.log('componentDidUpdate'); }
  componentWillUnmount() { console.log('componentWillUnmount'); }
  render() { console.log('render'); return (<div> test </div>); }
}
export default TestLifeCycle;
