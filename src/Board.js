// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (rowIndex) {
      var counter = 0;
      var innerArray = this.attributes[rowIndex];
      for (var i = 0; i < innerArray.length; i++) {
        if (innerArray[i] === 1) {
          counter++;
        }
        if (counter > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      for (var key in this.attributes) {
        var counter = 0;
        var innerArray = this.attributes[key];
        for (var j = 0; j < innerArray.length; j++) {
          if (innerArray[j] === 1) {
            counter++;
          }
          if (counter > 1) {
            return true;
          }
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      var pieceIndex = [];
      for (var key in this.attributes) {
        var innerArray = this.attributes[key];
        if ((innerArray[colIndex] === 1) && (pieceIndex.indexOf(colIndex) !== -1)) {
          return true;
        } else {
          pieceIndex.push(colIndex);
        }
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      var pieceIndex = [];
      for (var key in this.attributes) {
        for (var i = 0; i < this.attributes[key].length; i++) {
          if (this.attributes[key][i] === 1) {
            if (pieceIndex.indexOf(i) !== -1) {
              return true;
            } else {
              pieceIndex.push(i);
            }
          }
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      //accept a column
      var matrix = this.attributes;
      //iterate through arrays starting from the column value
      //needs to have a counter var
      var counter = 0;
      for (var row in matrix) {
        // var nextRow = Number(row) + 1;
        // var nextColumn = majorDiagonalColumnIndexAtFirstRow + 1;
        if (matrix[row][majorDiagonalColumnIndexAtFirstRow] === 1) {
          counter++;
        }
        majorDiagonalColumnIndexAtFirstRow++;
        if (counter > 1) {
          return true;
        }
        // if (this._isInBounds(nextRow, nextColumn)) {
        //   if (matrix[nextRow][nextColumn] === 1 && count < 2) {
        //     count++;
        //   } else if (matrix[nextRow][nextColumn] === 1 && count > 1) {
        //     return true;
        //   }
        // }

        //}
        // if ( counter > 1) {
        //   return true;

        // var matrix = [
        //   [0, 1, 0, 0],
        //   [0, 1, 1, 0],
        //   [0, 0, 1, 0],
        //   [0, 0, 0, 0]
        // ];
        // var board = new Board(matrix);
        // board.hasMajorDiagonalConflictAt(0);
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      //iterate through array of arrays
      for (var row in this.attributes) {
        for (var col = 0; col < this.attributes[row].length; col++) {
          if (this.hasMajorDiagonalConflictAt(col)) {
            return true;
          }
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      //accept a column
      var matrix = this.attributes;
      //iterate through arrays starting from the column value
      //needs to have a counter var
      var counter = 0;
      for (var row in matrix) {
        // var nextRow = Number(row) + 1;
        // var nextColumn = majorDiagonalColumnIndexAtFirstRow + 1;
        if (matrix[row][minorDiagonalColumnIndexAtFirstRow] === 1) {
          counter++;
        }
        minorDiagonalColumnIndexAtFirstRow--;
        if (counter > 1) {
          return true;
        }
        // if (this._isInBounds(nextRow, nextColumn)) {
        //   if (matrix[nextRow][nextColumn] === 1 && count < 2) {
        //     count++;
        //   } else if (matrix[nextRow][nextColumn] === 1 && count > 1) {
        //     return true;
        //   }
        // }

        //}
        // if ( counter > 1) {
        //   return true;

        // var matrix = [
        //   [0, 1, 0, 0],
        //   [0, 1, 1, 0],
        //   [0, 0, 1, 0],
        //   [0, 0, 0, 0]
        // ];
        // var board = new Board(matrix);
        // board.hasMajorDiagonalConflictAt(0);
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      for (var row in this.attributes) {
        for (var col = this.attributes[row].length - 1; col >= 0; col--) {
          if (this.hasMinorDiagonalConflictAt(col)) {
            return true;
          }
        }
      }
      return false; // fixme
    },

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());
