import type { EnumFraudAnalysisStatus } from "../../enums.js";
import type { ReplyDataResponseModel } from "./replay-data.model.js";

export interface FraudAnalysisResponseModel {
    id: string;
    status: EnumFraudAnalysisStatus;
    fraudAnalysisReasonCode: number;
    replyData: ReplyDataResponseModel;
}
