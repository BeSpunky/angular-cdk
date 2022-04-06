import { TickStoryDefinition } from '../tick-definitions.stories';

export function wrapStoryInSVGTimeline(story: string)
{
    return /*html*/`
    <!--
        SVG has a wrapping div because setting 'bsTimeline' on the svg element itself causes the ResizeObserver
        of the timeline to fire constantly on mousemove, which in turn causes the timeline to flicker.
        Not sure why, but this is probably related with how SVGs are treated by the browser. Maybe even because
        of how Angular treats them, as this started happening after I upgraded the workspace to Angular v13.
        Another reason might be how storybook renders its component iframe, which might have changed along with
        the new storybook version after upgrading the nx workspace to v13.

        TODO: Test to see if this still occurs on a different project outside of storybook.
    -->
    <div bsTimeline [zoom]="zoom" [date]="now" [positionY]="50" style="padding: 0; margin: 0; width: 95vw; height: 85vh">
        <svg height="100%" width="100%">
            <line x1="50%" y1="0"
                x2="50%" y2="100%"
                stroke="purple" stroke-width="1"
            ></line>
            ${story}
        </svg>
    </div>
    `;
}

export function createSVGTickTemplate({ tickId, minZoom, maxZoom, color, width, offset }: TickStoryDefinition): string
{    
    return /*html*/`
    <g *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${tickId}']; dayFactor: dayFactors['${tickId}']; datesBetween: datesBetween['${tickId}']; let tick;">
        <line [attr.x1]="tick.screenPositionX" [attr.y1]="tick.screenPositionY + ${offset}"
              [attr.x2]="tick.screenPositionX" [attr.y2]="tick.screenPositionY + tick.sizeUnit"
              stroke-width="${width}" stroke="${color}"
        ></line>

        <text style="user-select: none" [attr.x]="tick.screenPositionX" [attr.y]="tick.screenPositionY" dx="4" dy="${offset}" font-size="20">{{tick.label}}</text>
    </g>
    `;
}