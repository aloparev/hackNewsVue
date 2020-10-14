<template>
        <form onsubmit="return false;" class="add-item">
            <input type="text" v-model="title" placeholder="title"/>
            <button type="submit" v-on:click="addNews">Create</button>
        </form>
</template>

<script>
export default {
    data() {
        return {
            title:""
        }
    },
    methods: {
        addNews: function(){
            this.$emit("addNews", {title:this.title, vote:0})
            this.title = "";
        }
    }
}
</script>

<style>

</style>