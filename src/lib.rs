use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize};
use near_sdk::collections::Vector;
use near_sdk::collections::LookupMap;
use near_sdk::{env, near_bindgen};
use std::time::{SystemTime, UNIX_EPOCH};


near_sdk::setup_alloc!();

const ONE_NEAR: u128 = 1000000000000000000000000;


#[derive(Serialize, BorshSerialize, BorshDeserialize)]
pub struct Comment {
    author: String,
    content: String,
}

impl Comment {
    pub fn new(author: String, content: String) -> Self {
        let time = SystemTime::now().duration_since(UNIX_EPOCH).expect("Time went backwards").as_millis();
        Comment {
            author,
            content,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Post {
    comments: Vector<Comment>,
    id: String
}

impl Post {
    pub fn new(id: String) -> Self {
        let mut prefix = Vec::with_capacity(33);
        // Adding unique prefix.
        prefix.push(b's');
        // Adding the hash of the account_id (key of the outer map) to the prefix.
        // This is needed to differentiate across accounts.
        prefix.extend(env::sha256(id.as_bytes()));
        Post {
            comments: Vector::new(prefix),
            id: id
        }
    }
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Contract {
    // String is the post_id
    posts: LookupMap<String, Post>,
    comment_cost: u128
}


impl Default for Contract {
    fn default() -> Self {
        Self {
            posts: LookupMap::new(b"r".to_vec()),
            comment_cost: ONE_NEAR / 100 // 0.01 NEAR
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

        Self { posts: LookupMap::new(b"r".to_vec()), comment_cost: ONE_NEAR / 100 }
    }

    pub fn set_comment_cost(&mut self, new_cost: String) {
        let new_cost = new_cost.parse::<u128>().unwrap();

        assert!(env::predecessor_account_id() == env::current_account_id(), "Owner's method");

        self.comment_cost = new_cost;
        let log_message = format!("Set comment cost to {}", new_cost);
        env::log(log_message.as_bytes());
    }

    pub fn create_post(&mut self, post_id: String) {
        assert!(env::predecessor_account_id() == env::current_account_id(), "Owner's method");
        let post = Post::new(post_id);
        self.posts.insert(&post.id, &post);
        let log_message = format!("Created post with ID {}", post.id);
        env::log(log_message.as_bytes());
    }

    pub fn get_comments(self, post_id: String) -> Vec<Comment> {
        let post = self.posts.get(&post_id);
        assert!(post.is_some(), "Post doesn't exist");
        post.unwrap().comments.to_vec()
    }

    #[payable]
    pub fn add_comment(&mut self, post_id: String, content: String) {
        // check that the attached deposit is enough
        assert!(near_sdk::env::attached_deposit() >= self.comment_cost, "Not enough near staked. Minimum is currently {} Near", self.comment_cost);
           
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


#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // part of writing unit tests is setting up a mock context
    // in this example, this is only needed for env::log in the contract
    // this is also a useful list to peek at when wondering what's available in env::*
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "robert.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    // Should panic if adding comment to post that doesn't exist
    #[test]
    #[should_panic]
    fn add_comment() {
        // set up the mock context into the testing environment
        let context = get_context(vec![], false);
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract = Contract { posts: LookupMap::new(b"r".to_vec()) };
        contract.add_comment("some_post".to_string(), "hello this is my comment".to_string());
    }
    
    // owner can create posts
    #[test]
    fn create_post() {
        // set up the mock context into the testing environment
        let context = get_context(vec![], false);
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract = Contract { posts: LookupMap::new(b"r".to_vec()) };
        contract.create_post("some_post".to_string());
        contract.get_comments("some_post".to_string());
    }
}
