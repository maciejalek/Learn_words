"""Build original advanced lesson meaning cards from the reviewed bilingual TSVs."""
from pathlib import Path
import json,csv,hashlib,textwrap,html
root=Path(__file__).resolve().parent.parent;dist=root/'dist';out=dist/'assets/advanced';out.mkdir(exist_ok=True)
specs=[('1','C1 · Society, rules & judgement','C1','#416c84','advanced-1.tsv'),('2','C2 · Nature & fine distinctions','C2','#527658','advanced-2.tsv'),('3','C1–C2 · Engineering precision','C1–C2','#755c94','advanced-3.tsv')]
topics=json.loads((dist/'topics.json').read_text());topics=[t for t in topics if t['code'] not in {'1','2','3'}]
for code,title,level,accent,file in specs:
 rows=[line.split('|') for line in (root/'content'/file).read_text().splitlines() if line.strip()];assert len(rows)==32 and all(len(r)==7 for r in rows)
 entries=[];bundle={}
 for kind in ['word','sentence']:
  for i,(term,pl,group,definition,example,example_pl,interpretation) in enumerate(rows):
   n=i+1 if kind=='word' else i+33;ident=f'topic_{code}_{n:02}';word=term if kind=='word' else example;meaning=pl if kind=='word' else example_pl;gloss=definition if kind=='word' else interpretation
   lines=textwrap.wrap(gloss,36);assert len(lines)<=8,(term,lines)
   texts=''.join(f'<text x="24" y="{85+j*25}" font-family="sans-serif" font-size="18" fill="#243842">{html.escape(line)}</text>' for j,line in enumerate(lines))
   svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320"><rect x="1" y="1" width="398" height="318" rx="20" fill="#fffefa" stroke="{accent}" stroke-width="2"/><path d="M20 1h360q19 0 19 20v25H1V21Q1 1 20 1" fill="{accent}"/><text x="24" y="30" font-family="sans-serif" font-size="14" fill="white">{html.escape(level)} · PRECISE MEANING</text>{texts}<text x="24" y="299" font-family="sans-serif" font-size="12" fill="{accent}">{html.escape(group)}</text></svg>'
   path=f'assets/advanced/{ident}.svg';(dist/path).write_text(svg);bundle[path]=svg
   entries.append(dict(id=ident,word=word,meaning_pl=meaning,kind=kind,person='lesson' if kind=='sentence' else None,category='advanced-'+group.lower().replace(' ','-'),focusGroup=group,topicCode=code,image=path,gloss=gloss,presentation='definition',headword=term,example=example,example_pl=example_pl,source='Original bilingual teaching text and vector meaning card',source_url='https://github.com/maciejalek/Learn_words',license='CC-BY-SA-4.0',changes='Original card; no third-party illustration.'))
 raw=json.dumps(bundle,ensure_ascii=False,separators=(',',':'));h=hashlib.sha256(raw.encode()).hexdigest()[:12];path=f'assets/advanced/pictures.{code}.{h}.json';(dist/path).write_text(raw)
 refs=['https://rm.coe.int/cefr-companion-vol-ume-with-new-descriptors-2018/1680787989']
 if code=='2':refs+=['https://www.epa.gov/expobox/exposure-assessment-tools-media-aquatic-biota']
 if code=='3':refs+=['https://www.mathworks.com/help/matlab/ref/cond.html','https://info.ornl.gov/sites/publications/Files/Pub162179.pdf']
 topics.append(dict(code=code,title=title,cefrTarget=level,presentation='definition',note='Advanced practice with close meanings and demanding contexts. The level is a teaching target, not an official rating for every individual word.',references=refs,entries=entries,bundle=path))
 with (dist/'lessons'/f'{code}.csv').open('w',encoding='utf-8-sig',newline='') as f:
  wr=csv.writer(f);wr.writerow(['English','Polish','Type','Meaning cue','Context example','Example in Polish']);wr.writerows((e['word'],e['meaning_pl'],e['kind'],e['gloss'],e['example'],e['example_pl']) for e in entries)
(dist/'topics.json').write_text(json.dumps(topics,ensure_ascii=False,indent=2));print([(t['code'],len(t['entries'])) for t in topics])
