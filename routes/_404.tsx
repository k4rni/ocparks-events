import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="flex items-center">
        <div class="flex items-center">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            404 - Page not found
          </h1>
        </div>
      </div>
    </>
  );
}
