require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/c371cd05c8df40c0af3b1515b808c9d737b98b02@/package.json'), [], function() { return {"uid":"http://github.com/cadorn/ace-extjs/packages/extjs4-ace/","name":"extjs4-ace","main":"lib/component.js","contexts":{"top":{"/lib/component":{"include":{"github.com/cadorn/ace-extjs/packages/extjs-ace/":{}}}}},"mappings":{"extjs-ace":{"location":"" + bravojs.mainModuleDir + "/aae9e0c4eed45f3c888f8e7824a96a83f5f8f861"},"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/c371cd05c8df40c0af3b1515b808c9d737b98b02@/lib/component'), ['extjs-ace/component'], function (require, exports, module)
{
    var COMPONENT = require("extjs-ace/component");

    exports.main = function()
    {
        COMPONENT.init();
        
        var component = COMPONENT.getComponent();

        component.extend = "Ext.panel.Panel";

        Ext.define("Ext.ux.AceEditor", component);
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
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/theme/mono_industrial'), ['pilot/dom'], function (require, exports, module) {


    var dom = require("pilot/dom");

    var cssText = ".ace-mono-industrial .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-mono-industrial .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-mono-industrial .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-mono-industrial .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-mono-industrial .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-mono-industrial .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-mono-industrial .ace_scroller {\
  background-color: #222C28;\
}\
\
.ace-mono-industrial .ace_text-layer {\
  cursor: text;\
  color: #FFFFFF;\
}\
\
.ace-mono-industrial .ace_cursor {\
  border-left: 2px solid #FFFFFF;\
}\
\
.ace-mono-industrial .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #FFFFFF;\
}\
 \
.ace-mono-industrial .ace_marker-layer .ace_selection {\
  background: rgba(145, 153, 148, 0.40);\
}\
\
.ace-mono-industrial .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-mono-industrial .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgba(102, 108, 104, 0.50);\
}\
\
.ace-mono-industrial .ace_marker-layer .ace_active_line {\
  background: rgba(12, 13, 12, 0.25);\
}\
\
       \
.ace-mono-industrial .ace_invisible {\
  color: rgba(102, 108, 104, 0.50);\
}\
\
.ace-mono-industrial .ace_keyword {\
  color:#A39E64;\
}\
\
.ace-mono-industrial .ace_keyword.ace_operator {\
  color:#A8B3AB;\
}\
\
.ace-mono-industrial .ace_constant {\
  color:#E98800;\
}\
\
.ace-mono-industrial .ace_constant.ace_language {\
  \
}\
\
.ace-mono-industrial .ace_constant.ace_library {\
  \
}\
\
.ace-mono-industrial .ace_constant.ace_numeric {\
  color:#E98800;\
}\
\
.ace-mono-industrial .ace_invalid {\
  color:#FFFFFF;\
background-color:rgba(153, 0, 0, 0.68);\
}\
\
.ace-mono-industrial .ace_invalid.ace_illegal {\
  \
}\
\
.ace-mono-industrial .ace_invalid.ace_deprecated {\
  \
}\
\
.ace-mono-industrial .ace_support {\
  \
}\
\
.ace-mono-industrial .ace_support.ace_function {\
  color:#588E60;\
}\
\
.ace-mono-industrial .ace_function.ace_buildin {\
  \
}\
\
.ace-mono-industrial .ace_string {\
  \
}\
\
.ace-mono-industrial .ace_string.ace_regexp {\
  \
}\
\
.ace-mono-industrial .ace_comment {\
  color:#666C68;\
background-color:#151C19;\
}\
\
.ace-mono-industrial .ace_comment.ace_doc {\
  \
}\
\
.ace-mono-industrial .ace_comment.ace_doc.ace_tag {\
  \
}\
\
.ace-mono-industrial .ace_variable {\
  \
}\
\
.ace-mono-industrial .ace_variable.ace_language {\
  color:#648BD2;\
}\
\
.ace-mono-industrial .ace_xml_pe {\
  \
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-mono-industrial";
});
__bravojs_loaded_moduleIdentifier = bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/theme/mono_industrial');