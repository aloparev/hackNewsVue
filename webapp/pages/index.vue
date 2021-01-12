<template>
  <div id="app">
    <NavBar />
    <h3 class="title">The Country Roads</h3>
    <div class="container">
      <ListNews />
    </div>
  </div>
</template>

<style>
body {
  background: #f0f8ff;
}

#app {
  text-align: center;
  padding-top: 5%;
}

.nav-bar {
  width: 100%;
  text-align: right;
  margin: auto;
  padding: 10px 0;
  width: 1000px;
}

.nav-bar a {
  background: #17dbef;
  padding: 5px 50px;
  border-radius: 2px;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #000000;
}

.container {
  margin: 0 auto;
  align-items: center;
  text-align: center;
  padding: 20px;
  max-height: 800px;
  margin-top: 10px;
  box-shadow: 0px 0px 4px 4px gray;
  border-radius: 10px;
  background: #fff;
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
  background: #9b84f996;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
