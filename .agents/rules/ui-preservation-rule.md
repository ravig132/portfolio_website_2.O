# UI Preservation & Design Lock Rule

All AI assistants, LLMs, and subagents operating in this workspace must strictly follow these rules:

1. **Frozen UI Architecture**: Under no circumstances should the design language, theme, layout, or color palette of the portfolio be modified or replaced.
2. **Design Tokens**: The design tokens in `style.css` (variables under `:root` including `--bg-dark: #050914`, `--accent-cyan: #00f2ff`, `--accent-blue: #0055ff`, etc.) must remain unchanged.
3. **Core Features**:
   - Liquid Canvas Particles (`#liquid-canvas` running at 60fps)
   - Cursor Radial Glow Follower (`#cursor-glow`)
   - 3D Ice Cube Hero Visual with integrated photograph (`assets/my_image.png`)
   - 3D Tilt Cards (`.tilt-card`)
   - Interactive Bubble Sort Live Algorithm Visualizer (`#algo-bars-area`)
   - EmailJS Contact Form with established keys
4. **Reference**: See `UI_DESIGN_LOCK_SPECIFICATION.md` for full token, element, and component specifications.
