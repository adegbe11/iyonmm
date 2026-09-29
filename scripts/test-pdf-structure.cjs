const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const Module=require('node:module');const ts=require('typescript');
const filename=path.resolve(__dirname,'../lib/pdf-structure.ts');const mod=new Module(filename,module);mod.filename=filename;mod.paths=module.paths;
mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {makeBlocks,validateJson}=mod.exports;
const span=(text,y,size=12,endOfLine=true)=>({text,x:10,y,width:60,height:size,fontName:'font',fontSize:size,endOfLine});
const blocks=makeBlocks([span('Project notes',20,24),span('Hello',50,12,false),{...span('world',50),x:75},span('1. Task',80),span('Body text',110)]);
assert.equal(blocks.length,4);assert.equal(blocks[0].type,'heading');assert.equal(blocks[1].text,'Hello world');assert.equal(blocks[1].bounds.width,125);assert.equal(blocks[2].type,'listItem');assert.deepEqual(blocks[1].spanIndexes,[1,2]);
assert.deepEqual(makeBlocks([]),[]);assert.equal(validateJson('{"pages":[]}').error,'');assert.ok(validateJson('{bad}').error);assert.ok(validateJson('[]').error);
console.log('PASS: text grouping, inferred headings/lists, bounds, source indexes, empty pages, JSON validation.');
