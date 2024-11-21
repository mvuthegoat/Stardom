export const createTask = async (imageUrl: string, prompt: string | undefined) => {
    try {
        const response = await fetch("/api/videogen/create-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: imageUrl,
                prompt: prompt ?? null, // Optional prompt from user input
            })
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create task.");
        }
        const data = await response.json();
        console.log("Task created successfully:", data);
        return data; // Contains taskId and any additional info
    } catch(error) {
        console.error("Error creating task:", error);
        throw error;
    
    }
}

export const queryTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/videogen/query-task-single?task_id=${taskId}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to query task.");
      }
  
      const data = await response.json();
      return data; // Contains task details and status
    } catch (error) {
      console.error("Error querying task:", error);
      throw error;
    }
  };
  