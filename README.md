# BLORG
Blogs, blogs never change. Except when they do. They are the locus of uncensored self expression in cyberspace.
In the beginning there were simple web blogs, made by deranged hackers hooked on dialup and the whole earth catalog.
Then came business. Yes, business. Geocities, Livejournal, the little known 'microblogging' platform known as Twitter, then there came opportunities for people to monetise their online ramblings. Substack, Patreon, etc. The trend is away from decentralised, user controlled platforms towards easier to use but more and more centralized platforms that take power away, even as they provide more exposure. WELL NO MORE!

Now there is a new cool new way of blogging. Imagine hosting your writing on the IMMUTABLE UNCENSORABLE BLOCKCHAIN. Imagine if your audience could freely add to the conversation, whilst being dissuaded from spamming by HAVING TO PAY TO COMMENT. Imagine if **engagement** also meant **financial support**.

The future is here - it's called Blorg!

## WHAT IS IT
Blorg is a system that allows you to publish a blog to the blockchain, and an accompanying frontend that makes it easy to use. But even better, it provides your readers an easy way to engage and support you. Blorg includes a pay-to-comment system that allows your readers to directly financially support you whilst adding to the conversation. This also has the upside of reducing spam comments.

- The backend is in Rust, and can be deployed to NEAR manually, by you.
- The frontend is a small React app.

### How to make Blorg your own

Make a NEAR account if you don't have one. To deploy this app to your account you need:
* Rustup
* NPM
* NEAR CLI

Clone this repo and change any mentions of `blorg.testnet` to your accountId. Then:

```
export CONTRACT_ID={put your contract ID here}
make build
make deploy
```

Now you are ready to write blog posts! Either host the blog somewhere or just `cd frontend && yarn && yarn start` to see it locally. Use the UI to start writing blog posts!

### Other cool stuff
You can change the minimum donation required for comments by calling the `set_comment_cost` method.

