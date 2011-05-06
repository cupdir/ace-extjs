require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/75facf7e3e2e534c307f54f259c3e920b1dc6965@/package.json'), [], function() { return {"uid":"http://github.com/cadorn/ace-extjs/packages/extjs3-ace/","name":"extjs3-ace","main":"lib/component.js","contexts":{"top":{"/lib/component":{"include":{"github.com/cadorn/ace-extjs/packages/extjs-ace/":{}}}}},"mappings":{"extjs-ace":{"location":"" + bravojs.mainModuleDir + "/aae9e0c4eed45f3c888f8e7824a96a83f5f8f861"},"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/75facf7e3e2e534c307f54f259c3e920b1dc6965@/lib/component'), ['extjs-ace/component'], function (require, exports, module)
{
    var COMPONENT = require("extjs-ace/component");

    exports.main = function()
    {
        COMPONENT.init();
        
        var component = COMPONENT.getComponent();

        Ext.ux.AceEditor = Ext.extend(Ext.BoxComponent, component);
    }
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/aae9e0c4eed45f3c888f8e7824a96a83f5f8f861@/package.json'), [], function() { return {"uid":"http://github.com/cadorn/ace-extjs/packages/extjs-ace/","name":"extjs-ace","main":"","contexts":{"top":{"/":{"load":{"github.com/cadorn/ace-extjs/packages/ace-editor/":{}}}}},"mappings":{"editor":{"location":"" + bravojs.mainModuleDir + "/a3d9ddf257e98144c883cd2dbc03ab62243dbc09"},"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/aae9e0c4eed45f3c888f8e7824a96a83f5f8f861@/lib/component'), ['pilot/dom','text!./component.css'], function (require, exports, module)
{
    var DOM = require("pilot/dom");

    exports.init = function()
    {
        DOM.importCssString(require("text!./component.css"));
    }

    exports.getComponent = function()
    {
        return {

            baseCls: "x-ux-ace-editor-panel",

            initComponent: function()
            {
                Ext.ux.AceEditor.superclass.initComponent.call(this);
                var self = this;

                self.editorClass = null;
                self.initialized = false;

                self.value = null;
                self.editor = null;
                
                self.session = null;

                // async load editor
                module.load("editor/main", function(id)
                {
                    self.editorClass = require(id);

                    // init the editor
                    self.editorClass.init(function(env)
                    {
                        var CANON = self.editorClass.module("pilot/canon");

                        self.addEvents(
                            "editor-save",
                            "editor-saveas"
                        );

                        CANON.addCommand({
                            name: "save",
                            bindKey: {
                                win: "Ctrl-S",
                                mac: "Command-S",
                                sender: "editor|cli"
                            },
                            exec: function()
                            {
                                self.fireEvent('editor-save', self);
                            }
                        });

                        CANON.addCommand({
                            name: "saveas",
                            bindKey: {
                                win: "Ctrl-Shift-S",
                                mac: "Command-Shift-S",
                                sender: "editor|cli"
                            },
                            exec: function()
                            {
                                self.fireEvent('editor-saveas', self);
                            }
                        });
                        
                        self.firstRender();
                    });
                });
            },

            firstRender: function()
            {
                var self = this;

                var EDITOR = self.editorClass.module("ace/editor").Editor,
                    RENDERER = self.editorClass.module("ace/virtual_renderer").VirtualRenderer,
                    THEME = self.editorClass.module("ace/theme/textmate");  // default
//                    var EVENT = self.editorClass.module("pilot/event");

                self.el.dom.innerHTML = "";
                
                self.renderer = new RENDERER(self.el.dom, THEME);
                self.editor = new EDITOR(self.renderer);
                self.editor.resize();

                self.initialized = true;

                if(self.value!==null)
                {
                    self.setValue(self.value[0], self.value[1]);
                }
            },

            onRender: function()
            {
                Ext.ux.AceEditor.superclass.onRender.apply(this, arguments);

                if (typeof this.el.addCls != "undefined")
                    this.el.addCls(this.baseCls);   // ExtJS 4
                else
                    this.el.addClass(this.baseCls);   // ExtJS 3

                if (!this.initialized)
                {
                    // TODO: Make this look nicer
                    this.el.dom.innerHTML = "Loading Editor ...";
                }
            },

            onResize: function( aw, ah )
            {
                if(this.editor) {
                    this.editor.resize();
                }
            },

            getValue: function()
            {
                return this.editor.getDocument().getValue();
            },

            getEditor: function()
            {
                return this.editor;
            },

            getSession: function()
            {
                return this.session;
            },

            getRenderer: function()
            {
                return this.renderer;
            },

            setValue: function(value, options)
            {
                if (!this.initialized)
                {
                    this.value = [value, options];
                    return;
                }
                this.value = null;

                options = options || {};

                var SESSION = this.editorClass.module("ace/edit_session").EditSession,
                    UNDO_MANAGER = this.editorClass.module("ace/undomanager").UndoManager;

                var session = new SESSION(value);
                session.setUndoManager(new UNDO_MANAGER());

                session.getDocument().addEventListener("changeDelta", function()
                {
                    self.fireEvent('editor-changeDelta', self);
                });

                var mode = "text";
                if (typeof options.mode != "undefined")
                {
                    mode = options.mode;
                }
                else
                {
                    if(typeof options.basename != "undefined")
                    {
                        if (/^.*\.js$/i.test(options.basename)) {
                            mode = "javascript";
                        } else if (/^.*\.xml$/i.test(options.basename)) {
                            mode = "xml";
                        } else if (/^.*\.html?$/i.test(options.basename)) {
                            mode = "html";
                        } else if (/^.*\.css$/i.test(options.basename)) {
                            mode = "css";
                        } else if (/^.*\.py$/i.test(options.basename)) {
                            mode = "python";
                        } else if (/^.*\.php$/i.test(options.basename)) {
                            mode = "php";
                          } else if (/^.*\.cs$/i.test(options.basename)) {
                              mode = "csharp";
                        } else if (/^.*\.java$/i.test(options.basename)) {
                            mode = "java";
                        } else if (/^.*\.rb$/i.test(options.basename)) {
                            mode = "ruby";
                        } else if (/^.*\.(c|cpp|h|hpp|cxx)$/i.test(options.basename)) {
                            mode = "c_cpp";
                        } else if (/^.*\.coffee$/i.test(options.basename)) {
                            mode = "coffee";
                        } else if (/^.*\.(pl|pm)$/i.test(options.basename)) {
                            mode = "perl";
                        }
                    }
                }

                var self = this;

                this.setMode(mode, {
                    session: session,
                    callback: function(session)
                    {
                        self.editor.setSession(session);

                        self.session = session;

                        if (typeof options.callback != "undefined")
                        {
                            options.callback(session);
                        }
                    }
                });
            },

            setMode: function(name, options)
            {
                // TODO: display loading message

                var self = this;

                var session = options.session || self.session;
                if (!session)
                    throw new Error("Session required!");

                // async load mode
                module.load("ace/mode/" + name, function(id)
                {
                    var modeObj = new (require(id).Mode);
                    session.setMode(modeObj);

                    if (typeof options.callback != "undefined")
                    {
                        options.callback(session);
                    }
                });                
            },

            setTheme: function(name)
            {
                this.editor.setTheme("ace/theme/" + name);
            },

            setKeyboardHandler: function(name, options)
            {
                if (name === null)
                {
                    this.editor.setKeyboardHandler(null);
                    return;
                }
                var self = this;

                // TODO: This should be done more generically
                var id = "ace/keyboard/keybinding/" + name;
                if (name == "hash_handler") {
                    id = "ace/keyboard/" + name;
                }

                // async load keybinding
                module.load(id, function(id)
                {
                    var obj = require(id);

                    // TODO: This should be done more generically
                    if (name == "vim") {
                        obj = obj.Vim;
                    } else
                    if (name == "emacs") {
                        obj = obj.Emacs;
                    } else
                    if (name == "hash_handler") {
                        obj = new obj.HashHandler(options);
                    }

                    self.editor.setKeyboardHandler(obj);
                });
            },

            setFontSize: function(value)
            {
                this.el.dom.style.fontSize = value;
            }
        };
    }
});
require.memoize('text!'+bravojs.realpath(bravojs.mainModuleDir + '/aae9e0c4eed45f3c888f8e7824a96a83f5f8f861@/lib/component.css'), [], function () {
return ["",".x-ux-ace-editor-panel {","    border-style: solid;","    border-width: 0;","    border-color: #99bbe8;","    background-color: #ffffff;","}",""].join("\n");
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/theme/dawn'), ['pilot/dom'], function (require, exports, module) {


    var dom = require("pilot/dom");

    var cssText = ".ace-dawn .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-dawn .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-dawn .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-dawn .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-dawn .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-dawn .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-dawn .ace_scroller {\
  background-color: #F9F9F9;\
}\
\
.ace-dawn .ace_text-layer {\
  cursor: text;\
  color: #080808;\
}\
\
.ace-dawn .ace_cursor {\
  border-left: 2px solid #000000;\
}\
\
.ace-dawn .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #000000;\
}\
 \
.ace-dawn .ace_marker-layer .ace_selection {\
  background: rgba(39, 95, 255, 0.30);\
}\
\
.ace-dawn .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-dawn .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgba(75, 75, 126, 0.50);\
}\
\
.ace-dawn .ace_marker-layer .ace_active_line {\
  background: rgba(36, 99, 180, 0.12);\
}\
\
       \
.ace-dawn .ace_invisible {\
  color: rgba(75, 75, 126, 0.50);\
}\
\
.ace-dawn .ace_keyword {\
  color:#794938;\
}\
\
.ace-dawn .ace_keyword.ace_operator {\
  \
}\
\
.ace-dawn .ace_constant {\
  color:#811F24;\
}\
\
.ace-dawn .ace_constant.ace_language {\
  \
}\
\
.ace-dawn .ace_constant.ace_library {\
  \
}\
\
.ace-dawn .ace_constant.ace_numeric {\
  \
}\
\
.ace-dawn .ace_invalid {\
  \
}\
\
.ace-dawn .ace_invalid.ace_illegal {\
  text-decoration:underline;\
font-style:italic;\
color:#F8F8F8;\
background-color:#B52A1D;\
}\
\
.ace-dawn .ace_invalid.ace_deprecated {\
  text-decoration:underline;\
font-style:italic;\
color:#B52A1D;\
}\
\
.ace-dawn .ace_support {\
  color:#691C97;\
}\
\
.ace-dawn .ace_support.ace_function {\
  color:#693A17;\
}\
\
.ace-dawn .ace_function.ace_buildin {\
  \
}\
\
.ace-dawn .ace_string {\
  color:#0B6125;\
}\
\
.ace-dawn .ace_string.ace_regexp {\
  color:#CF5628;\
}\
\
.ace-dawn .ace_comment {\
  font-style:italic;\
color:#5A525F;\
}\
\
.ace-dawn .ace_comment.ace_doc {\
  \
}\
\
.ace-dawn .ace_comment.ace_doc.ace_tag {\
  \
}\
\
.ace-dawn .ace_variable {\
  color:#234A97;\
}\
\
.ace-dawn .ace_variable.ace_language {\
  \
}\
\
.ace-dawn .ace_xml_pe {\
  \
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-dawn";
});
__bravojs_loaded_moduleIdentifier = bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/theme/dawn');