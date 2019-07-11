import React from 'react'
import './App.css'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
class App extends React.Component {

  state = {
    endpoint: 'http://wheaterbeanstalk-env-1.us-east-1.elasticbeanstalk.com',
    // endpoint: 'http://localhost',
    ts: moment().format('LTS'),
    data: {}
  }

  componentDidMount () {
    const socket = socketIOClient(this.state.endpoint)
    socket.on('WEATHER', data => this.setState({data: Object.assign({}, data, this.state.data), ts: new Date()}, () => console.log('updated')))
  }

  _getTs = (ts) => `${ts}`

  _getInfoBox = ({key, value: {temperature, datetime}}) => {
    const tempNumber = parseInt(temperature)
    return (
      <div key={key} style={{ height: 150, width: 150, backgroundColor: 'blue', color: 'white', margin: '0px 10px', display: 'flex', flexDirection: 'column' }}>
        <p>{key}</p>
        <p>{Math.round((tempNumber - 32) * 5/9) } ºC</p>
        <span>{moment(datetime.substr(0, datetime.length-6)).format('lll')}</span>
      </div>
    )
  }

  _sortElements = (a,b) => {
      const keyA= a.key.toLowerCase(), keyB=b.key.toLowerCase()
      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
  }


  render () {
    const { ts, data } = this.state
    console.log('DEBUG: render -> data', data)
    return (
      <div className='App'>
        <header>
          <h4>
          {this._getTs(ts)}
          </h4>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div  style={{ display: 'flex' }}>
            {Object.entries(data).map(([key, value]) => ({ key, value })).sort(this._sortElements).map(this._getInfoBox)}
          </div>
        </div>
      </div>
    )
  }
}

export default App