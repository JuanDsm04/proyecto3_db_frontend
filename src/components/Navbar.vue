<script setup lang="ts">
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Proyecto 3</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink 
            :class="{ 'nav-link': true, active: $route.path === '/' }" 
            aria-current="page" 
            to="/">
            Clientes
          </RouterLink>
          <RouterLink 
            :class="{ 'nav-link': true, active: $route.path === '/authors' }" 
            to="/authors">
            Autores
          </RouterLink>
          <RouterLink 
            :class="{ 'nav-link': true, active: $route.path === '/employees' }" 
            to="/employees">
            Empleados
          </RouterLink>
          <RouterLink 
            :class="{ 'nav-link': true, active: $route.path === '/loans' }" 
            to="/loans">
            Préstamos
          </RouterLink>
          <RouterLink 
            :class="{ 'nav-link': true, active: $route.path === '/fines' }" 
            to="/fines">
            Multas
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>
