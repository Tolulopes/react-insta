var ITEMS_PER_PAGE = 6;
var LIMIT = 20;
var cx = React.addons.classSet;

var InstaThumbnail = React.createClass({
  getInitialState: function() {
    return {
      isDefault: true
    };
  },

  propTypes: {
    items: React.PropTypes.array.isRequired
  },

  updateViewMode: function (isDefault) {
    this.setState({isDefault: isDefault});
  },

  render: function () {
    var className = cx({
      'is-default': this.state.isDefault,
      'insta-thumbnails': true
    });

    var listNodes = this.props.items.map(function (item, i) {
      return (
        <li key={i} className='insta-thumbnail'>
          <figure>
            <img src={item.images.low_resolution.url} />
          </figure>
        </li>
      )
    }, this);

    return (
      <section className={className}>
        <ToolBar fnc={this.updateViewMode}/>
        <ul>
          {listNodes}
        </ul>
      </section>
    );
  }

});

var ToolBar = React.createClass({
  updateViewMode: function (isDefault) {
    this.props.fnc(isDefault);
  },

  render: function () {
    return (
      <div className='tool-bar'>
        <ViewToggler func={this.updateViewMode}/>
      </div>
    )
  }
});

var ViewToggler = React.createClass({
  toggleView: function (isDefault) {
    this.props.func(isDefault);
  },

  getFourGridSVG: function () {
    return (
      `<svg class='four-grid' height="20" width="55" xmlns="http://www.w3.org/2000/svg">
          <g>
              <rect class='container' stroke="#005fbf" height="20" width="55" y="0" x="0" stroke-width="0.5" fill="none" />
              <rect class='block' y="2.75" x="3.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="16.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="29.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="42.25" stroke-width="0.5" />
          </g>
      </svg>`
    )
  },

  getThreeGridSVG: function () {
    return (
      `<svg class='three-grid' height="20" width="55" xmlns="http://www.w3.org/2000/svg">
          <g>
              <rect class='container' stroke="#005fbf" height="20" width="55" y="0" x="0" stroke-width="0.5" fill="none" />
              <rect class='block' y="2.75" x="3.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="16.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="29.25" stroke-width="0.5" />
              <rect class='block' y="2.75" x="42.25" stroke-width="0.5" />
          </g>
      </svg>`
    )
  },

  render: function () {
    return (
      <span className='view-toggler'>
        <span onClick={this.toggleView.bind(null, false)} dangerouslySetInnerHTML={{__html: this.getFourGridSVG()}}></span>
        <span onClick={this.toggleView.bind(null, true)} dangerouslySetInnerHTML={{__html: this.getThreeGridSVG()}}></span>
      </span>
    )
  }
});

var InstaContainer = React.createClass({
    getInitialState: function () {
      return {
        items: []
      };
    },

    componentWillMount: function () {
      var instaURL = 'https://api.instagram.com/v1/media/popular?client_id=' + this.props.apiKey + '&callback=?';
      $.getJSON(instaURL)
        .done(function (result) {
          if (this.isMounted() && result.meta && result.meta.code === 200) {
            console.log(result.data);
            this.setState({
              items: result.data.splice(0, LIMIT),
              loaded: true
            });
          }
        }.bind(this));
    },

    getPulseSVG: function () {
      return (
        `<svg class='pulse' width='100' height='100' viewBox='0 0 100 100' stroke='#125688'>
            <g fill='none' fill-rule='evenodd' stroke-width='2'>
            <circle cx='50' cy= '50' r='1'>
                <animate attributeName='r' begin='0s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' />
                <animate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' />
            </circle>
            <circle cx='50' cy='50' r='1'>
                <animate attributeName='r' begin='-0.9s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' />
                <animate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' />
            </circle>
            </g>
        </svg>`
        );
    },

    render: function () {
      if (this.state.items.length) {
        return (
          <div>
            <InstaThumbnail items={this.state.items}/>
          </div>
        );
      }

      return (
          <div className="svg-container" dangerouslySetInnerHTML={{__html: this.getPulseSVG()}}>
          </div>
      );
    }
});

React.render(<InstaContainer apiKey="642176ece1e7445e99244cec26f4de1f"/>, document.getElementById('carousel-container'));
