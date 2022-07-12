import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getUserQuery = (username) => `query {
    repositoryOwner(login: "${username}") {
    repositories(last: 20) {
      nodes {
        name
        url
        languages(first: 1) {
          nodes {
            color
            id
            name
          }
        }
        updatedAt
      }
      totalCount
    }
    ... on User {
      avatarUrl
      bio
      name
      status {
        user {
          followers {
            totalCount
          }
          following {
            totalCount
          }
          watching {
            totalCount
          }
          login
        }
      }
    }
  }
}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + token (Personal Access Token --github)
        Authorization: "Bearer <ADD_YOUR_PERSONAL_ACCESS_TOKEN_HERE>",
      },

      body: JSON.stringify({
        query: getUserQuery(value),
      }),
    };
    setLoading(true);

    fetch("https://api.github.com/graphql", options)
      .then((resp) => resp.json())
      .then((resp) => {
        const data = resp.data.repositoryOwner;
        if (data !== null) {
          setResult(data);
          setValue("");
          setError(false);
          setLoading(false);
          setMsg(null);
        } else {
          setResult(null);
          setValue("");
          setError(false);
          setLoading(false);
          setMsg(
            "Oop! Your search did not return a result. Try another username"
          );
        }
      })
      .catch((e) => {
        setResult(null);
        setValue("");
        setError(true);
        setLoading(false);
        setMsg(null);
      });
  };

  return (
    <div>
      <form className="mb-5 flex justify-center" onSubmit={handleSubmit}>
        <div className="mt-6">
          {msg && <p className="text-center text-red-600">{msg}</p>}
          {error && (
            <p className="text-center text-red-600">'Something went wrong!</p>
          )}
          <div className="mb-3 pt-6">
            <label className="block">Github Username</label>
            <input
              type="search"
              className="border px-2 py-2 w-64 rounded-lg focus:outline-none mt-3"
              required
              placeholder="e.g samsonemes"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 px-2 w-64 rounded-lg mt-4 text-white py-1"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>

      {/* result of our query */}
      {result && (
        <div className="flex justify-center">
          <div>
            <div>
              <img src={result.avatarUrl} alt="avatar" className="w-64" />
            </div>

            <h4 className="text-center font-bold">{result.name}</h4>

            <div className="flex justify-center mt-4">
              <ul>
                <li>
                  <span className="font-semibold">Total Repos:</span>{" "}
                  {result.repositories.totalCount}
                </li>
              </ul>
            </div>
          </div>

          {/* TODO: display other result fields */}
        </div>
      )}
    </div>
  );
}

export default App;
