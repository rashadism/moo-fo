import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

const { theme } = makeColors({
  label: 'Moo-FO',
  roles: { accent: '#ff4fa3', danger: '#ff5a5f', success: '#3ddc84', warning: '#ffb020', pro: '#3fd0ff' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f1e7ff',
        'surface-1': '#f7f0ff',
        'surface-2': '#fcf8ff',
        'text-primary': '#24143f',
        'text-secondary': '#4a3870',
        'text-muted': '#62518a',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#150d2e',
        'surface-1': '#1a1136',
        'surface-2': '#1f153f',
        'surface-3': '#241949',
        'text-primary': '#f1eaff',
        'text-secondary': '#cdc1ea',
        'text-muted': '#a99bd0',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'moo-fo', glass: { blur: 2, opacity: 0.65 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.theme.set(LOOK)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== 'moo-fo' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="Cows wander a hill under a smiling sun or moon while two flying saucers now and then beam one up"
        isInteractive
      />
    )
  })
}
