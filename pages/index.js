import { request } from 'https';
import Link from 'next/link';
import Head from 'next/head'
import { useEffect, useState } from 'react';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;
export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json()
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {

  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });

  const { current } = page;
  
  useEffect(() => {
    if ( current === defaultEndpoint ) return;
    
    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return
      }

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint
    });
  }

  return (
    <div className='container'>

      <Head>
        <title>Rick and Morty Wiki</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className='title'>
        <h1>
          Wubba Lubba Dub Dub!
        </h1>

        <p className='description'>
          Rick and Morty Character Wiki
        </p>

        <form className='search' onSubmit={handleOnSubmitSearch}>
          <input name='query' type='search' />
          <button>Search</button>
        </form>

        <ul className='grid'>
          {results.map(result => {
            const { id, name, image } = result;
            return (

              <li key={id} className='card'>
                <Link href='/character/[id]' as={`/character/${id}`}>
                  <img src={image} alt={`${name} Thumbnail`} />
                  <h3>{ name }</h3>
                </Link>
              </li>

            )
          })}
        </ul>

        <p>
          <button onClick={handleLoadMore} className='update-button'>Load More</button>
        </p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .title a {
          color: #0070f3;
          text-decoration: none;
        }
        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        .title,
        .description {
          text-align: center;
        }
        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .logo {
          height: 1em;
        }
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        button {
          cursor: pointer;
          width: 5em;
        }

        .update-button {
          padding: .5em;
          width: 7em;
        }

        .search input {
          margin-right: .5em;
        }

        @media (max-width: 600px) {
          .search input {
            margin-right: 0;
            margin-bottom: .5em;
          }

          .search input,
          .search button {
            width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}