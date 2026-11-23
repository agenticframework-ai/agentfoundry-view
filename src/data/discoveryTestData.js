import testDataMarkdown from '../../testdata.md?raw';

const sections=Array.from(testDataMarkdown.matchAll(/^## (Positive|Negative) test: (.+)$/gm));

export const discoveryTestCases=sections.map((section,index)=>{
  const start=section.index+section[0].length;
  const end=sections[index+1]?.index??testDataMarkdown.length;
  const content=testDataMarkdown.slice(start,end);
  const answers=Object.fromEntries(content.split(/\r?\n/)
    .filter(line=>/^\|\s*[^|]+\s*\|\s*[^|]+\s*\|$/.test(line))
    .map(line=>line.split('|').slice(1,-1).map(cell=>cell.trim()))
    .filter(([field])=>field&&field!=='Field'&&!/^[-:\s]+$/.test(field)));
  const expectedReview=content.match(/\*\*Expected review:\*\*\s*([\s\S]*?)(?=\r?\n\r?\n|$)/)?.[1].trim()||'';

  return {
    id:section[1].toLowerCase(),
    title:section[2].trim(),
    answers,
    expectedReview
  };
});
