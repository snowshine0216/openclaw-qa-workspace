# XMindMark Syntax Reference

Quick reference for XMindMark. Full spec: [MarkXMind docs](https://github.com/jinzcdev/markxmind/tree/main/docs).

## Central Topic

The first non-empty line is the central topic. Empty lines before it are ignored.

```
Central Topic
```

## Hierarchy

- Start lines with `-` or `*`; at least one space after
- Main topics (first level): no indentation
- Sub-topics: indent with spaces (1 tab = 4 spaces)
- Indentation level determines hierarchy

```
Central Topic

- Main Topic 1
- Main Topic 2
    * Subtopic 2.1
    * Subtopic 2.2
- Main Topic 3
    * Subtopic 3.1
        - Subtopic 3.1.1
```

Empty lines between same-level topics are ignored.

## Relationships

- `[n]` marks source topic
- `[^n]` marks target topic; same number creates connection
- `[^n](Title)` adds relationship title

```
Central Topic

* Source topic [1]
* Target topic [^1](Related)
```

Relationship connects only when source and target share the same parent. Markers must directly follow content (no spaces).

## Boundaries

- `[B]` or `[B1]` after topic content
- Consecutive same-level topics with same marker are wrapped
- Use numbers to distinguish multiple boundaries: `[B1]`, `[B2]`
- Boundary title: separate line, same indent, `[B]: Title` or `[B1]: Title`

```
Central Topic

- main topic
    * topic 1 [B1]
    * topic 2 [B1]
    [B1]: Boundary Title
    * topic 3 [B2]
    * topic 4 [B2]
    [B2]: Another Boundary
```

## Summaries

- `[S]` or `[S1]` marks topics to summarize
- `[S]: Summary Title` or `[S1]: Summary Title` sets title
- Summary can have sub-topics (unlike boundary)

```
Central Topic

* topic 1 [S]
* topic 2 [S]
[S]: Summary Title
    - subtopic 1
    - subtopic 2
```

## Multiple Markers

A topic can combine markers; no spaces between content and markers:

```
topic [B1][^2][S1]
```

Example: boundary + relationship + summary on one topic.

## Rules

- Markers must directly follow topic content (no spaces)
- Numbers in `[n]` / `[^n]` need not be consecutive
- Floating topics are not supported
- To use `[]` in content, escape: `\[\]`
