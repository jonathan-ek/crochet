import re


def list_rindex(li, x):
    for i in reversed(range(len(li))):
        if li[i] == x:
            return i
    raise ValueError("{} is not in list".format(x))


def parse_range(astr):
    result = set()
    for part in astr.split(','):
        x = part.split('-')
        result.update(range(int(x[0]), int(x[-1]) + 1))
    return sorted(result)


def expand(parts, stitch_symbols, expanded):
    multiplier = 1
    if expanded is None:
        expanded = []
    i = 0
    while i < len(parts):
        p = parts[i]
        internal_expanded = []
        multiplier_set = False
        if p.isdigit():
            multiplier = int(p)
            multiplier_set = True
        elif p in stitch_symbols:
            internal_expanded.append(p)
        elif p == '(':
            index = list_rindex(parts, ')')
            expand(parts[i + 1:index], stitch_symbols, internal_expanded)
            i = index
        elif p.startswith('#'):
            internal_expanded.append(f"change_color {p.strip('# ')}")

        internal_expanded = internal_expanded * multiplier
        try:
            if parts[i + 1] == '*':
                if not parts[i + 2].isdigit():
                    raise Exception(f'Unknown command: {" ".join(parts)}')
                expanded += internal_expanded * int(parts[i + 2])
                i += 3
            else:
                expanded += internal_expanded
        except IndexError:
            expanded += internal_expanded
        if not multiplier_set:
            multiplier = 1
        i += 1


class Row:
    def __init__(self, nr, row, stitches):
        self.nr = nr
        self.row = row
        self.stitches = stitches
        self.expanded = []
        self.comment = ''
        stitch_symbols = [x for x, y in stitches]
        tmp = row.split('//', 1)
        if len(tmp) == 2:
            rest, self.comment = tmp
        else:
            rest = tmp[0]
        pattern = f'(([0-9])+|(\()|(\))|\*|#(.*)#|{"|".join(stitch_symbols)})'
        parts = [x[0] for x in re.findall(pattern, rest.strip())]
        expand(parts, stitch_symbols, self.expanded)

    def __len__(self):
        symbols = dict([(x, 1 if y != '++' else 2) for x, y in self.stitches])
        return sum([symbols[x] for x in self.expanded if x in symbols])

    def __str__(self):
        return self.row


class Part:
    def __init__(self, rows, stitches):
        self.name = rows[0].strip(':')
        self.rows = []

        for row_str in rows[1:]:
            row_nr, rest = row_str.strip(' -\n\t').split(':', 1)
            try:
                row_nrs = parse_range(row_nr)
            except ValueError:
                row_nrs = [row_nr]
            for nr in row_nrs:
                self.rows.append(Row(nr, rest, stitches))

    def get_row_count(self):
        return len(self.rows)

    def get_stitch(self, row, i):
        return self.rows[row].expanded[i]

    def __len__(self):
        return sum([len(x) for x in self.rows])

    def __str__(self):
        return self.name


class Pattern:
    def __init__(self, file):
        with open(file, 'r') as fp:
            lines = [l for l in fp.readlines() if l.strip()]
        section = None
        parts = []
        current_indent = 0
        current_part = []
        parts.append(current_part)
        self.stitches = []
        self.part_list = []
        for line in lines:
            if line.lower().startswith('parts:'):
                section = 'parts'
                continue
            if line.lower().startswith('stitches:'):
                section = 'stitches'
                continue
            if line.lower().startswith('part list:'):
                section = 'part_list'
                continue
            if section == 'parts':
                indent = re.search('\\S', line).start()
                if indent < current_indent:
                    current_part = []
                    parts.append(current_part)
                current_indent = indent
                current_part.append(line.strip())
            elif section == 'stitches':
                tmp = line.strip(' -\n\t')
                if "[++]" in tmp:
                    self.stitches.append((tmp.replace("[++]", "").strip(), '++'))
                elif "[--]" in tmp:
                    self.stitches.append((tmp.replace("[--]", "").strip(), '--'))
                else:
                    self.stitches.append((tmp, None))
            elif section == 'part_list':
                nr, part = line.strip(' -\n\t').split(',')
                self.part_list.append((part.strip(), int(nr)))
        self.parts = dict()
        for part in parts:
            p = Part(part, self.stitches)
            self.parts[p.name] = p
            print(p, len(p))

    def __len__(self):
        s = 0
        for part, count in self.part_list:
            s += len(self.parts[part]) * count
        return s


def main():
    print(len(Pattern('patterns/kanin.cro')))
    print(len(Pattern('patterns/bibbi.cro')))


if __name__ == '__main__':
    main()
