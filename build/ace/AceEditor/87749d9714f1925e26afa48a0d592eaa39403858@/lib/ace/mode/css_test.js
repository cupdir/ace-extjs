require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/css_test'), ['ace/edit_session','ace/mode/css','ace/test/assertions','asyncjs'], function (require, exports, module) {


var EditSession = require("ace/edit_session").EditSession;
var CssMode = require("ace/mode/css").Mode;
var assert = require("ace/test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new CssMode();
    },

    "test: toggle comment lines should not do anything" : function() {
        var session = new EditSession(["  abc", "cde", "fg"].join("\n"));

        var comment = this.mode.toggleCommentLines("start", session, 0, 1);
        assert.equal(["  abc", "cde", "fg"].join("\n"), session.toString());
    },


    "test: lines should keep indentation" : function() {
        assert.equal("   ", this.mode.getNextLineIndent("start", "   abc", "  "));
        assert.equal("\t", this.mode.getNextLineIndent("start", "\tabc", "  "));
    },

    "test: new line after { should increase indent" : function() {
        assert.equal("     ", this.mode.getNextLineIndent("start", "   abc{", "  "));
        assert.equal("\t  ", this.mode.getNextLineIndent("start", "\tabc  { ", "  "));
    },

    "test: no indent increase after { in a comment" : function() {
        assert.equal("   ", this.mode.getNextLineIndent("start", "   /*{", "  "));
        assert.equal("   ", this.mode.getNextLineIndent("start", "   /*{  ", "  "));
    }
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/test/assertions'), ['assert'], function (require, exports, module) {


var assert = require("assert");
    
assert.position = function(cursor, row, column) {
    assert.equal(cursor.row, row);
    assert.equal(cursor.column, column);
};

assert.range = function(range, startRow, startColumn, endRow, endColumn) {
    assert.position(range.start, startRow, startColumn);
    assert.position(range.end, endRow, endColumn);
};

assert.notOk = function(value) {
    assert.equal(value, false);   
}

exports.jsonEquals = function(foundJson, expectedJson) {
    assert.equal(JSON.stringify(foundJson), JSON.stringify(expectedJson));
};

module.exports = assert;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09@/modules/assert'), [], function (require, exports, module) {

});
__bravojs_loaded_moduleIdentifier = bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/css_test');