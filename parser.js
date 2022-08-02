const listRIndex = (li, x) => {
    let idx = li.indexOf(x);
    const indices = [];
    while (idx !== -1) {
        indices.push(idx);
        idx = li.indexOf(x, idx + 1);
    }
    return indices[-1];
};

const parseRange = (astr) => {
    const result = new Set();
    astr.split(',').forEach((part) => {
        const x = part.split('-')
        const start = parseInt(x[0]);
        const end = parseInt(x[x.length - 1]) + 1;
        [...Array(end - start).keys()].map(i => i + start).forEach((nr) => result.add(nr));
    });
    return Array.from(result.values()).sort((a, b) => a - b);
}

const expand = (parts, symbols) => {
    const expanded = [];
    let multiplier = 1;
    let i = 0;
    while (i < parts.length) {
        let p = parts[i];
        let internalExpanded = [];
        let multiplierSet = false;
        if (!isNaN(p)) {
            multiplier = parseInt(p, 10)
            multiplierSet = true;
        } else if (symbols.includes(p)) {
            internalExpanded.push(p)
        } else if (p === '(') {
            let index = listRIndex(parts, ')');
            const tmp = expand(parts.slice(i + 1, index), symbols);
            tmp.forEach((k) => internalExpanded.push(k));
            i = index;
        } else if (p.startsWith('#')) {
            internalExpanded.push(`change_color ${p.replace(/^#/, '').trim()}`)
        }
        internalExpanded = Array.from(Array(multiplier)).reduce((acc) => {
            internalExpanded.forEach((j) => {
                acc.push(j);
            })
            return acc;
        }, [])
        if (parts[i + 1] === '*') {
            if (isNaN(parts[i + 2])) {
                throw Error(`Unknown command: ${parts.join(' ')}`)
            }
            internalExpanded = Array.from(Array(parseInt(parts[i + 2], 10))).reduce((acc) => {
                internalExpanded.forEach((i) => {
                    acc.push(i);
                })
                return acc;
            }, [])
            i += 2;
        }
        internalExpanded.forEach((i) => expanded.push(i));
        if (!multiplierSet) {
            multiplier = 1;
        }
        i += 1;
    }
    return expanded;
};

const rowParser = (nr, row, stitches) => {
    const stitchSymbols = stitches.map(([x, y]) => x);
    const data = {
        nr, row, expanded: [], comment: undefined,
    };
    const tmp = row.split('//');
    let rest;
    if (tmp.length >= 2) {
        let comment;
        [rest, ...comment] = tmp;
        data.comment = comment.join('//').trim()
    } else {
        rest = tmp[0]
    }
    const pattern = RegExp(`(([0-9])+|(\\()|(\\))|\\*|#(.*)#|${stitchSymbols.join("|")})`, 'g');
    const parts = Array.from(rest.trim().matchAll(pattern)).map((x) => x[0]);
    data.expanded = expand(parts, stitchSymbols);
    return data;
};

const partParser = (rows, stitches) => {
    const part = {
        name: rows[0].replace(/:/, '').trim(), rows: [],
    };
    rows.forEach((row_str, i) => {
        if (i === 0) {
            return;
        }

        let [row_nr, ...rest] = row_str.trim().replace(/^-/, '').trim().split(':')
        rest = rest.join(':')
        let row_nrs;
        try {
            row_nrs = parseRange(row_nr);
        } catch (e) {
            row_nrs = [row_nr];
        }
        row_nrs.forEach((nr) => {
            if (!rest) {
                return;
            }
            part.rows.push(rowParser(nr, rest, stitches))
        })
    })
    return part;
};

const parse = (data) => {
    const pattern = {
        stitches: [], parts: {}, part_list: []
    };
    let section;
    let currentIndent = 0;
    let currentPart = [];
    const parts = [currentPart];
    data.split('\n').forEach((line) => {
        if (!line.trim()) {
            return;
        }
        if (line.toLowerCase().startsWith('parts:')) {
            section = 'parts'
            return;
        }
        if (line.toLowerCase().startsWith('stitches:')) {
            section = 'stitches'
            return;
        }
        if (line.toLowerCase().startsWith('part list:')) {
            section = 'part_list'
            return;
        }
        if (section === 'parts') {
            const indent = line.search('\\S', line);
            if (indent < currentIndent) {
                currentPart = [];
                parts.push(currentPart);
            }
            currentIndent = indent;
            currentPart.push(line.trim())
        } else if (section === 'stitches') {
            const trimmed_line = line.trim().replace(/^-/, '').trim();
            if (trimmed_line.includes('[++]')) {
                pattern.stitches.push([trimmed_line.replace('[++]', '').trim(), '++'])
            } else if (trimmed_line.includes('[--]')) {
                pattern.stitches.push([trimmed_line.replace('[--]', '').trim(), '++'])
            } else {
                pattern.stitches.push([trimmed_line, undefined]);
            }
        } else if (section === 'part_list') {
            const [nr, part] = line.trim().replace(/^-/, '').trim().split(',');
            pattern.part_list.push([part.trim(), parseInt(nr)]);
        }
    })
    parts.forEach((part) => {
        p = partParser(part, pattern.stitches);
        pattern.parts[p.name] = p;
    });
    return pattern;
};

module.exports = {
    parse,
};
