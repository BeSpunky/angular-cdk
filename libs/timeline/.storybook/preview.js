import { addDecorator } from '@storybook/angular';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs);

export const parameters = {
    options: {
        storySort: {
            order: [
                'Timeline',
                [
                    '*bsTimelineTick',
                    [
                        'SVG',
                        'Div'
                    ]
                ]
            ]
        }
    }
};
