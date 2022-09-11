<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<!--
	<header>
		<nav>
			<RouterLink to="/s/share">Share</RouterLink>
			<RouterLink to="/s">Retrieve</RouterLink>
		</nav>
	</header>
	-->

	<main>
		<RouterView />
	</main>
</template>

<style>
	@import './assets/main.css';
</style>
