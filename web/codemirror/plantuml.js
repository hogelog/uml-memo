import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';

CodeMirror.defineSimpleMode("plantuml", {
    // The start state contains the rules that are intially used
    start: [
        // The regex matches the token, the token property contains the type
        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
        // Rules are matched in the order in which they appear, so there is
        // no ambiguity between this one and the one above
        {regex: /^(?:@start|@end)(?:uml|dot|mindmap|salt|wbs|gantt)$/, token: "keyword"},
        {regex: /(?:actor|class|object|if|else|endif|activate|deactivate|note)\b/, token: "keyword"},
        {regex: /'.*/, token: "comment"},
        // A next property will cause the mode to move to a different state
        {regex: /\/'/, token: "comment", next: "comment"},
        // indent and dedent properties guide autoindentation
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true}
    ],
    // The multi-line comment state.
    comment: [
        {regex: /.*?'\//, token: "comment", next: "start"},
        {regex: /.*/, token: "comment"}
    ]
});
