import { action } from '@storybook/addon-actions';
import News from './News.vue';

export default {
    title: 'News',
    component:News
};

const newsTemplate = '<news :news="news" @delete-news="deleteNews(news.id)" @update="update"/>';

const NewsT = (args, {argTypes}) => ({
    components: {News},
    template: newsTemplate,
    props:Object.keys(argTypes),
    methods:{
        deleteNews: action('deleteNews'),
        update: action('update')
    }
});

const newsDefaultData = {
    id:1,
    title:'The CountryRoads',
    votes:0
};

export const Default = NewsT.bind({});
Default.args = {
    news: newsDefaultData
};

