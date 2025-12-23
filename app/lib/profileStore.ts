const profileStore: Record <string , any> = {}

export  function saveProfile(githubUsername: string , profile: any){

    profileStore[githubUsername] = profile
}

export function getProfile(githubUsername: string) {
    return profileStore[githubUsername]
}