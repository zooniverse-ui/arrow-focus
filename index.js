;(function() {
  'use strict';

  var React;
  if (typeof require !== 'undefined') {
    React = require('react');
  } else if (typeof window !== 'undefined') {
    React = window.React;
  }

  var ARROW_KEYS = {
    '37':'LEFT',
    '38':'UP',
    '39':'RIGHT',
    '40':'DOWN'
  };

  function ArrowFocus() {
    React.Component.apply(this, arguments);
  }

  ArrowFocus.propTypes = {
    component: React.PropTypes.node,
    step: React.PropTypes.number,
    focusables: React.PropTypes.string
  };

  ArrowFocus.defaultProps = {
    component: 'div',
    step: 5,
    focusables: 'a, button, input, select, textarea, [tabindex]'
  };

  ArrowFocus.prototype = Object.assign(Object.create(React.Component.prototype), {
    getAdjacent: function(element, direction, step, container) {
      var elementRect = element.getBoundingClientRect();

      var x = pageXOffset + (elementRect.left + (element.offsetWidth / 2));
      var y = pageYOffset + (elementRect.top + (element.offsetHeight / 2));

      var focusables = container.querySelectorAll(this.props.focusables);
      var siblings = Array.prototype.slice.call(focusables);

      while (true) {
        if (direction === 'LEFT') {
          x -= step;
        } else if (direction === 'RIGHT') {
          x += step;
        } else if (direction === 'UP') {
          y -= step;
        } else if (direction === 'DOWN') {
          y += step;
        }

        var found = document.elementFromPoint(x, y);

        if (found !== element && siblings.indexOf(found) !== -1) {
          return found;
        } else if (x < 0 || y < 0 || x > (pageXOffset + innerWidth) || y > (pageYOffset + innerHeight)) {
          return null;
        }
      }
    },

    render: function() {
      var props = Object.assign({}, this.props, {
        className: ('arrow-focus ' + (this.props.className || '')).trim(),
        onKeyDown: this.handleKeyDown.bind(this)
      });

      return React.createElement(this.props.component, props, this.props.children);
    },

    handleKeyDown: function (event) {
      if (this.props.onKeyDown !== undefined) {
        this.props.onKeyDown.apply(null, arguments);
      }

      try {
        var canSelect = document.activeElement.selectionStart !== undefined;
      } catch (error) {
        // Chrome throws an error on accessing invalid `selectionStart`s. No worries.
      }

      var direction = ARROW_KEYS[event.which];

      if (!canSelect && direction !== undefined) {
        var nextInLine = this.getAdjacent(document.activeElement, direction, this.props.step, React.findDOMNode(this));
        if (nextInLine !== null) {
          nextInLine.focus();
        }
      }
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = ArrowFocus;
  } else if (typeof window !== 'undefined') {
    window.ZUIArrowFocus = ArrowFocus;
  }
}());
