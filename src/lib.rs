use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::TreeMap;
use near_sdk::collections::Vector;
use near_sdk::serde::Serialize;
use near_sdk::{env, near_bindgen};

near_sdk::setup_alloc!();

const ONE_NEAR: u128 = 1000000000000000000000000;

#[derive(Serialize, BorshSerialize, BorshDeserialize)]
pub struct Comment {
    author: String,
    content: String,
}

impl Comment {
    pub fn new(author: String, content: String) -> Self {
        Comment { author, content }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize)]
pub struct PostListing {
    post_id: String,
    title: String,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Post {
    comments: Vector<Comment>,
    id: String,
    title: String,
    content: String,
    // contract owner is always the author
}

#[derive(BorshSerialize, BorshDeserialize, Serialize)]
pub struct ApiPost {
    comments: Vec<Comment>,
    id: String,
    title: String,
    content: String,
    // contract owner is always the author
}

impl Post {
    pub fn new(id: String, title: String, content: String) -> Self {
        let mut prefix = Vec::with_capacity(33);
        // Adding unique prefix.
        prefix.push(b's');
        // Adding the hash of the account_id (key of the outer map) to the prefix.
        // This is needed to differentiate across accounts.
        prefix.extend(env::sha256(id.as_bytes()));
        Post {
            comments: Vector::new(prefix),
            id,
            title,
            content,
        }
    }
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Contract {
    // String is the post_id
    posts: TreeMap<String, Post>,
    comment_cost: u128,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            posts: TreeMap::new(b"e".to_vec()),
            comment_cost: ONE_NEAR / 100, // 0.01 NEAR
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init(ignore_state)]
    pub fn clear_state() -> Self {
        assert!(
            env::predecessor_account_id() == env::current_account_id(),
            "only I can call this"
        );

        Self {
            posts: TreeMap::new(b"e".to_vec()),
            comment_cost: ONE_NEAR / 100,
        }
    }

    pub fn set_comment_cost(&mut self, new_cost: String) {
        let new_cost = new_cost.parse::<u128>().unwrap();

        assert!(
            env::predecessor_account_id() == env::current_account_id(),
            "Owner's method"
        );

        self.comment_cost = new_cost;
        let log_message = format!("Set comment cost to {}", new_cost);
        env::log(log_message.as_bytes());
    }

    pub fn create_post(&mut self, post_id: String, title: String, content: String) {
        assert!(
            env::predecessor_account_id() == env::current_account_id(),
            "Owner's method"
        );
        let post = Post::new(post_id, title, content);
        // Check that the post ID doesn't already exist!
        self.posts.insert(&post.id, &post);
        let log_message = format!("Created post with ID {}", post.id);
        env::log(log_message.as_bytes());
    }

    pub fn get_post(self, post_id: String) -> ApiPost {
        let post = self.posts.get(&post_id);
        assert!(post.is_some(), "Post doesn't exist");
        match post {
            Some(p) => ApiPost {
                comments: p.comments.to_vec(),
                id: p.id,
                content: p.content,
                title: p.title,
            },
            None => panic!("post does not exist"),
        }
    }

    pub fn get_posts_listing(self) -> Vec<PostListing> {
        let mut post_listing: Vec<PostListing> = vec![];
        for (_, post) in self.posts.into_iter() {
            post_listing.push(PostListing {
                post_id: post.id,
                title: post.title,
            });
        }
        // for this to work we need to convert from a LookupMap to either TreeMap or UnorderedMap
        // apparently it's imposible to iterate LookupMap.
        // https://docs.rs/near-sdk/2.0.0/near_sdk/collections/struct.TreeMap.html
        return post_listing;
    }

    pub fn get_comments(self, post_id: String) -> Vec<Comment> {
        let post = self.posts.get(&post_id);
        assert!(post.is_some(), "Post doesn't exist");
        post.unwrap().comments.to_vec()
    }

    #[payable]
    pub fn add_comment(&mut self, post_id: String, content: String) {
        // check that the attached deposit is enough
        assert!(
            near_sdk::env::attached_deposit() >= self.comment_cost,
            "Not enough near staked. Minimum is currently {} Near",
            self.comment_cost
        );
        // check if the post exists in the map
        let post = self.posts.get(&post_id);
        assert!(post.is_some(), "Post doesn't exist");
        let mut post = post.unwrap();

        let author = env::predecessor_account_id();
        let new_comment = Comment::new(author, content);
        post.comments.push(&new_comment);
        self.posts.insert(&post_id, &post);
        let log_message = format!("Added comment {} to post", new_comment.content.clone());
        env::log(log_message.as_bytes());
    }
}
