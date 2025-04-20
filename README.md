# pac-snk (it's a fork of Platane/snk) 

Generates a snake game from a github user contributions graph

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/rhuanhianc/pac-snk/blob/output-svg-only/github-pacman-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/rhuanhianc/pac-snk/blob/output-svg-only/github-pacman.svg" />
  <img alt="github-snake" src="github-snake.svg" />
</picture>

Pull a github user's contribution graph.
Make it a snake Game, generate a snake path where the cells get eaten in an orderly fashion.

Generate a [gif](https://github.com/Platane/snk/raw/output/github-contribution-grid-snake.gif) or [svg](https://github.com/Platane/snk/raw/output/github-contribution-grid-snake.svg) image.

Available as github action. It can automatically generate a new image each day. Which makes for great [github profile readme](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme)


**local**

```
npm install

npm run dev:demo
```

## Implementation

[solver algorithm](./packages/solver/README.md)
