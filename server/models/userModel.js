import { Datastore } from '@google-cloud/datastore';
import "dotenv/config";

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  databaseId: process.env.GCP_DATABASE_ID_LOGIN_INFO,
  keyFilename: process.env.GCP_KEY_FILE
});

class UserModel {
  static KIND = 'User';
  
  // Find a user by email
  static async findOne(email) {
    const query = datastore
      .createQuery(this.KIND)
      .filter('email', '=', email)
      .limit(1);
    
    const [users] = await datastore.runQuery(query);
    
    if (!users || users.length === 0) {
      return null;
    }
    
    const user = users[0];
    const key = user[datastore.KEY];
    
    // Return user with extracted ID
    return {
      id: key.id, // This will be numeric if we created it correctly
      ...user
    };
  }
  
  // Create a new user with explicitly numeric ID
  static async create(userData) {
    try {
      // Generate a timestamp-based ID
      const numericId = parseInt(Date.now().toString(), 10);
      
      // IMPORTANT: Ensure we're creating a key with a numeric ID, not a name
      const key = datastore.key({
        namespace: undefined,
        path: [this.KIND, numericId]
      });
      
      console.log("Creating user with key:", key);
      
      const entity = {
        key,
        data: {
          name: userData.name,
          email: userData.email,
          image: userData.image || '',
          createdAt: new Date()
        }
      };
      
      // Save the entity with the specified key
      await datastore.save(entity);
      
      // Log what was saved
      console.log("Saved user with ID:", numericId);
      
      // Return user with the numeric ID
      return {
        id: numericId,
        ...userData
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  // Update user method - now uses numeric ID
  static async updateUser(id, updateData) {
    try {
      // Ensure ID is numeric
      const numericId = parseInt(id, 10);
      
      // Create a key with the numeric ID
      const key = datastore.key({
        namespace: undefined,
        path: [this.KIND, numericId]
      });
      
      // Get the current user
      const [currentUser] = await datastore.get(key);
      if (!currentUser) {
        throw new Error(`User with ID ${numericId} not found`);
      }
      
      // Update the user data
      const updatedUser = {
        ...currentUser,
        ...updateData,
        updatedAt: new Date()
      };
      
      // Save the updated user
      await datastore.save({
        key,
        data: updatedUser
      });
      
      return {
        id: numericId,
        ...updatedUser
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
  // Delete a user by ID
  static async deleteUser(id) {
    try {
      const numericId = parseInt(id, 10);
      const key = datastore.key({
        namespace: undefined,
        path: [this.KIND, numericId]
      });
      
      await datastore.delete(key);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

// Modified Authentication Controller
export const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { name, email, picture } = userRes.data;
    let user = await UserModel.findOne(email);

    if (!user) {
      user = await UserModel.create({
        name, 
        email, 
        image: picture
      });
    }
    // );
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Include unique ID
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );
    

    return res.status(200).json({
      message: 'Success',
      token,
      user: {
        name: user.name,
        email: user.email,
        image: user.image
      }
    });

  } catch(error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export default UserModel;