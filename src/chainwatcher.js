var Transaction = React.createClass({
  render: function() {
    return (
      <div className='transaction'>
        {this.props.children}
      </div>
    );
  }
});

var TransactionList = React.createClass({
  getHash: function(transaction) {
    if (transaction === undefined) {
      return '';
    }
    var payload = transaction.payload;
    if (payload === undefined || payload.type !== 'new-transaction') {
      return '';
    }
    return payload.transaction.hash;
  },
  render: function() {
    var outer = this;
    var transactionNodes = this.props.data.map(function(transaction) {
      var hash = outer.getHash(transaction);
      return (
        <Transaction>
          {hash}
        </Transaction>
      );
    });
    return (
      <div className='transactionList'>
        {transactionNodes}
      </div>
    );
  }
});

var TransactionBox = React.createClass({
  getInitialState: function() {
    return {data: new RingBuffer(10)};
  },
  componentDidMount: function() {
    if (window.MozWebSocket) {
      window.WebSocket = window.MozWebSocket;
    }
    var conn = new WebSocket('wss://ws.chain.com/v2/notifications');
    conn.onopen = function(ev) {
      var req = {type: 'new-transaction', block_chain: 'bitcoin'};
      conn.send(JSON.stringify(req));
    };
    var outer = this;
    conn.onmessage = function(ev) {
      var data = JSON.parse(ev.data);
      outer.state.data.push(data);
      outer.setState({data: outer.state.data});
    };
    conn.onclose = function(ev) {
      var conn = new WebSocket('wss://ws.chain.com/v2/notifications');
    };
  },
  render: function() {
    return (
      <div className='transactionBox'>
        <h1>Transactions</h1>
        <TransactionList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <TransactionBox />,
  document.getElementById('content')
);
