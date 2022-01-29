use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{env, near_bindgen};

near_sdk::setup_alloc!();


#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Post {
    comments: Vector<Comment>,
}


impl Default for Post {
    fn default() -> Self {
        Self {
            comments: Vector::new(b"r".to_vec()),
        }
    }
}

#[near_bindgen]
impl Post {
    pub fn get_comments(self) -> Vec<String> {
        self.comments.to_vec()
    }

    pub fn add_comment(&mut self, content: String) {
        self.comments.push(&content);
        let log_message = format!("Added comment {} to post", content.clone());
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

    // mark individual unit tests with #[test] for them to be registered and fired
    #[test]
    fn add_comment() {
        // set up the mock context into the testing environment
        let context = get_context(vec![], false);
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract = Post { comments: vec![] };
        contract.add_comment("hello this is my comment".to_string());

        assert_eq!(vec![Comment { content: "hello this is my comment".to_string() }], contract.get_comments());
    }
}
