<template>
    <div>
        <div class="list-item">
            <h1>News List</h1>
            <news 
                v-for="item in sortedNews"
                :key="item.id"
                v-bind:news="item" 
                @deleteNews="deleteNews(item.id)"
                @update="update"
            />
        </div>
        <create-news @addNews="addNews" />
    </div>
</template>
 
<script>
import News from './News.vue';
import CreateNews from './CreateNews.vue';

export default {
    name: 'list-news',
    data () {
        return {
            list:[
                {id:0, title:'Just', votes:0},
                {id:1, title:'VueJS', votes:0},
                {id:2, title:'Rocks', votes:0}
            ]
        };
    },
    components: {
        News,
        CreateNews
    },
    methods:{
        deleteNews: function(id){
            this.list = this.list.filter(e => e.id !== id);
        },
        addNews: function(newNews){
            let id = Math.max(...this.list.map(e => e.id), 0);
            id++;
        
            // create new object from old one and overwrite id value
            this.list.push({...newNews, id: id});
        },
        update: function(news){
            this.list.find(e => e.id == news.id).votes = news.votes;
        }
    },
    computed:{
        sortedNews(){
            let newList = [...this.list];
            return newList.sort((x,y) => y.votes - x.votes);
        }
    }
};
</script>
