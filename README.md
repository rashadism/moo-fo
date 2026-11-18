# Moo-FO

A theme for the Claude desktop and mobile apps. Deep violet panels, hot pink and cyan accents, and a backdrop that moves.

A small herd of cows grazes on a hill, wandering in and out of view. Now and then one of two flying saucers drifts in, picks a cow, beams it up spinning and kicking, and leaves. Sometimes both are at work at once. A new cow strolls in later. The whole thing runs on a two-minute loop under a smiling moon and twinkling stars.

In light mode the moon becomes a sun and the sky turns blue. The scene follows the system's light or dark setting and stops moving when reduced motion is on.

## Install

At the prompt of a terminal session:

```
/plugin install moo-fo --marketplace rashadism/moo-fo
```

From a shell:

```
claude plugin install moo-fo --marketplace rashadism/moo-fo
```

Answer `y` to add the marketplace, then pick a scope. The user scope applies it to every session.

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `rashadism/moo-fo`, then Add plugin.

## Changing it

- `hooks/register.tsx` holds the colours and the panel glass (`blur` and `opacity`). Lower the opacity to see more of the scene, raise it for calmer text.
- `hooks/scene.js` builds the backdrop as one SVG animated with CSS.
- `hooks/make-colors.js` comes from Claude Code's plugin-authoring skill and is kept as shipped.

## License

MIT
