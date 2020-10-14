<template>
    <div>
        <h2>{{news.title}} ({{news.vote}})</h2>
        <div class="list-action-btn">
            <button @click="updateItem(1)">Upvote</button>
            <button @click="updateItem(-1)">Downvote</button>
            <button @click="deleteItem">Remove</button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        news: Object,
        default: null
    },
    methods: {
        deleteItem : function(){
            this.$emit("deleteNews", this.news);
        },
        updateItem : function(value){
            this.news.vote += value;
            this.$emit("sortNews");
        }
    }
}
</script>

<style>

</style>