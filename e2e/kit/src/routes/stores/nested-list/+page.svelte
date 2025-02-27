<script lang="ts">
  import {
    GQL_Cities,
    GQL_AddCity,
    GQL_AddLibrary,
    GQL_AddBook,
    GQL_DeleteCity,
    GQL_DeleteLibrary,
    GQL_DeleteBook,
    type ForceReturn$options,
    GQL_RemoveBook
  } from '$houdini';
  import { onMount } from 'svelte';

  onMount(() => {
    GQL_Cities.fetch();
  });

  const addCity = (event: Event) => {
    const target = event?.target as HTMLInputElement;
    GQL_AddCity.mutate({ name: target.value });
    target.value = '';
  };

  const deleteCity = (event: Event) => {
    const target = event?.target as HTMLButtonElement;
    if (!target.dataset.id) {
      return;
    }
    GQL_DeleteCity.mutate({ city: target.dataset.id });
  };

  const addLibrary = (event: Event) => {
    const target = event?.target as HTMLInputElement;
    if (!target.dataset.id) {
      return;
    }

    GQL_AddLibrary.mutate({ city: target.dataset.id, name: target.value });
    target.value = '';
  };

  const deleteLibrary = (event: Event) => {
    const target = event?.target as HTMLButtonElement;
    if (!target.dataset.id) {
      return;
    }
    GQL_DeleteLibrary.mutate({ library: target.dataset.id });
  };

  const addBook = (event: Event) => {
    const target = event?.target as HTMLInputElement;
    if (!target.dataset.id) {
      return;
    }

    GQL_AddBook.mutate({ library: target.dataset.id, title: target.value });
    target.value = '';
  };

  const removeBook = (event: Event) => {
    const target = event?.target as HTMLButtonElement;
    if (!target.dataset.id) {
      return;
    }
    GQL_RemoveBook.mutate(
      {
        book: target.dataset.id,
        force: (target.dataset.force as ForceReturn$options) ?? 'NORMAL'
      },
      { optimisticResponse: { deleteBook: { id: target.dataset.id } } }
    );
  };

  const deleteBook = (event: Event) => {
    const target = event?.target as HTMLButtonElement;
    if (!target.dataset.id) {
      return;
    }
    GQL_DeleteBook.mutate(
      {
        book: target.dataset.id,
        force: (target.dataset.force as ForceReturn$options) ?? 'NORMAL'
      },
      { optimisticResponse: { deleteBook: { id: target.dataset.id } } }
    );
  };
</script>

<h1>Nested - List</h1>

<ul>
  {#each $GQL_Cities.data?.cities ?? [] as city}
    <li>
      {city?.id}: {city?.name}
      <button data-id={city?.id} on:click={deleteCity}>Delete</button>
      <ul>
        {#each city?.libraries ?? [] as library}
          <li>
            {library?.id}: {library?.name}
            <button data-id={library?.id} on:click={deleteLibrary}>Delete</button>
            <ul>
              {#each library?.books ?? [] as book}
                <li>
                  {book?.id}: {book?.title}
                  <button data-id={book?.id} on:click={removeBook}>Remove</button>
                  <button data-id={book?.id} data-force="NULL" on:click={removeBook}
                    >Remove (null)</button
                  >
                  <button data-id={book?.id} data-force="ERROR" on:click={removeBook}
                    >Remove (error)</button
                  >
                  <button data-id={book?.id} on:click={deleteBook}>Delete</button>
                  <button data-id={book?.id} data-force="NULL" on:click={deleteBook}
                    >Delete (null)</button
                  >
                  <button data-id={book?.id} data-force="ERROR" on:click={deleteBook}
                    >Delete (error)</button
                  >
                </li>
              {/each}
              <li><input data-id={library?.id} on:change={addBook} /></li>
            </ul>
          </li>
        {/each}
        <li><input data-id={city?.id} on:change={addLibrary} /></li>
      </ul>
    </li>
  {/each}
  <li>
    <input on:change={addCity} />
  </li>
</ul>

<pre>{JSON.stringify($GQL_Cities?.data, null, 4)}</pre>

<style>
  button {
    font-size: small;
    padding: 0.5rem;
  }
</style>
